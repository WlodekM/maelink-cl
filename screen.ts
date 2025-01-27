// deno-lint-ignore ban-unused-ignore
// deno-lint-ignore ban-unused-ignore
// deno-lint-ignore-file no-process-globals ban-ts-comment no-explicit-any ban-unused-ignore
// ^ problem solved
import { Key } from "node:readline";
import type { Element, Input, Text, Button } from "./elements.ts"
import { Buffer } from "node:buffer";
import process from "node:process";
import type { Client } from "./main.ts";

const logs: string[] = [];

function onexit() {
    console.clear()
    console.log("\nQuitting meower CL")
    for (const log of logs) {
        console.log(log)
    }
}

export class Screen {
    elements: Map<string, Element|Input|Text|Button> = new Map();
    name: string;
    focusedElementId: string = '';
    logs = logs
    client: Client;

    constructor(name: string, client: any) {
        this.name = name;
        this.client = client
    }

    call(function_name:string, ...args:any) {
        for (const element of this.elements) {
            //@ts-ignore
            element[1][function_name](...args)
        }
    }

    handleKeypress(_chunk: Buffer, key: Key, screen: Screen) {
        const focusableIDs = Object.keys(screen.getFocusable());
        const focusedIndex = focusableIDs.indexOf(screen.focusedElementId);
        if (key && key.name == 'escape' || key.name == "c" && key.ctrl) {
            onexit();
            Deno.exit(0);
        }
        
        if (['up', 'left'].includes(key.name ?? '') || key.name == "tab" && key.shift) {
            // logs.push(`Got up key, moving focus upward ${focusedIndex} ${(focusedIndex - 1) % focusableIDs.length}`)
            screen.focus(focusableIDs[(focusedIndex - 1) % focusableIDs.length]);
            return screen.render()
        }
        if (['down', 'right'].includes(key.name ?? '') || key.name == "tab" && !key.shift) {
            // logs.push(`Got down key, moving focus downward ${focusedIndex} ${(focusedIndex + 1) % focusableIDs.length}`)
            screen.focus(focusableIDs[(focusedIndex + 1) % focusableIDs.length]);
            return screen.render()
        }

        // logs.push("pressed key, data: " + JSON.stringify(key))
        if (!screen.focusedElementId) return;
        const focusedElement = screen.getFocusedElement();
        focusedElement?.onkeypres(key)
    }

    getKeypressHandler(screen: Screen) {
        return (chunk: Buffer, key: Key) => this.handleKeypress(chunk,key, screen);
    }

    keypressHandler = this.getKeypressHandler(this)

    ready() {
        process.stdin.on('keypress', this.keypressHandler);
        this.render()
    }

    off() {
        process.stdin.off('keypress', this.keypressHandler)
    }

    addElement(name: string, element: Element) {
        if(this.elements.has(name)) throw new Error();
        element.screen = this;
        this.elements.set(name, element);
    }

    render() {
        console.clear()
        process.stdout.write("\u001b[2J") // use an ansi escape code to clear the screen if console.clear doesn't clear fully
        this.elements.forEach(element => {
            element.render();
        });
    }

    getFocusable() {
        return Object.fromEntries([...this.elements.entries()].filter(([_k, v]) => v.focusable))
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
