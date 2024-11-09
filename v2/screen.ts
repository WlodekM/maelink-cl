import type { Element } from "./elements.ts"
import readline from 'node:readline';

readline.emitKeypressEvents(process.stdin);

const logs: string[] = [];

function onexit() {
    console.clear()
    console.log("\nQuitting meower CL")
    for (const log of logs) {
        console.log(log)
    }
}

export class Screen {
    elements: Map<string, Element> = new Map<string, Element>();
    name: string;
    focusedElementId: string = '';

    constructor(name: string) {
        this.name = name;
    }

    handleKeypress(chunk: any, key: any, screen: Screen) {
        const focusableIDs = Object.keys(screen.getFocusable());
        const focusedIndex = focusableIDs.indexOf(screen.focusedElementId);
        if (key && key.name == 'escape') {
            onexit();
            process.exit();
        }
        
        if (['up', 'left'].includes(key.name)) {
            // logs.push(`Got up key, moving focus upward ${focusedIndex} ${(focusedIndex - 1) % focusableIDs.length}`)
            screen.focus(focusableIDs[(focusedIndex - 1) % focusableIDs.length]);
            return screen.render()
        }
        if (['down', 'right'].includes(key.name)) {
            // logs.push(`Got down key, moving focus downward ${focusedIndex} ${(focusedIndex + 1) % focusableIDs.length}`)
            screen.focus(focusableIDs[(focusedIndex + 1) % focusableIDs.length]);
            return screen.render()
        }

        // logs.push("pressed key, data: " + JSON.stringify(key))
        if (!screen.focusedElementId) return;
        const focusedElement = screen.getFocusedElement();
        focusedElement?.onkeypres(key)
        this.render()
    }

    getKeypressHandler(screen: Screen) {
        return (chunk: any, key: any) => this.handleKeypress(chunk,key, screen);
    }

    ready() {
        process.stdin.on('keypress', this.getKeypressHandler(this));
        this.render()
    }

    off() {
        process.stdin.off('keypress', this.getKeypressHandler(this))
    }

    addElement(name: string, element: Element) {
        if(this.elements.has(name)) throw new Error();
        element.screen = this;
        this.elements.set(name, element);
    }

    render() {
        console.clear()
        this.elements.forEach(element => {
            element.render()
        });
    }

    getFocusable() {
        return Object.fromEntries([...this.elements.entries()].filter(([k, v]) => v.focusable))
    }

    getElements() {
        return Object.fromEntries([...this.elements.entries()])
    }

    focus(id: string) {
        this.elements.forEach(e => e.focused = false);
        const focusElem = this.elements.get(id) as Element
        focusElem.focused = true;
        this.focusedElementId = id
    }

    getFocusedElement(): Element|undefined {
        return this.focusedElementId ? this.elements.get(this.focusedElementId) as Element : undefined
    }
}

if (process.stdin.isTTY) process.stdin.setRawMode(true); // makes the terminal send stdin without the user pressing enter
