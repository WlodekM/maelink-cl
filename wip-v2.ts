import readline, { Key } from 'node:readline';
import chalk from "chalk";

readline.emitKeypressEvents(process.stdin);

const logs: string[] = [];

function onexit() {
    console.clear()
    console.log("\nQuitting meower CL")
    for (const log of logs) {
        console.log(log)
    }
}

abstract class Element {
    focusable: boolean = false;
    focused: boolean = false;
    screen: Screen;
    abstract render(): void;
    onkeypres(key: Key): void {};
}

class Text extends Element {
    text: string;
    constructor(text: string) {
        super();
        this.text = text;
    }
    render() {
        process.stdout.write(this.text)
    }
}

class Input extends Element {
    focusable: boolean = true;
    value: string = "";

    isPassword: boolean = false;

    render(): void {
        let text = this.value
        if (this.isPassword) text = text.replace(/[^]/g, '*');
        if (this.focused) text += "_"
        console.log(text)
    }

    onkeypres(key: Key): void {
        //@ts-ignore
        if (key.meta || key.code || ["return", "backspace"].includes(key.name)) {
            switch (key.name) {
                case "return":
                    this.focused = false;
                    const focusableIDs = Object.keys(this.screen.getFocusable());
                    const focusedIndex = focusableIDs.indexOf(this.screen.focusedElementId);
                    this.screen.focus(focusableIDs[(focusedIndex - 1) % focusableIDs.length]);
                    break;
                
                case "backspace":
                    const prevValue = '' + this.value
                    // logs.push(`doing backspace : before ${prevValue}, after ${prevValue.substring(0, prevValue.length - 1)} : 0-${prevValue.length - 1}`)
                    this.value = prevValue.substring(0, prevValue.length - 1)
                    break;
            }
            return;
        }
        if (!key.sequence || key.sequence.length > 1 || key.name != key.sequence?.toLowerCase()) return;
        this.value += key.sequence;
    }

    constructor(isPassword: boolean, ) {
        super()
        this.isPassword = isPassword
    }
}

class Button extends Text {
    focusable: boolean = true;
    constructor (text: string) {
        super(text)
    }
    render(): void {
        console.log(`(${(this.focused ? chalk.bgWhite : a=>a)(this.text)})`)
    }
}

class Screen {
    elements: Map<string, Element> = new Map<string, Element>();
    name: string;
    focusedElementId: string = '';
    constructor(name: string) {
        this.name = name
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

// TODO: add focus change with arrows

const screen = new Screen("login");
screen.addElement('username-label', new Text("Username: \n"));
screen.addElement('username-input', new Input(false))
screen.addElement('password-label', new Text("Password: \n"));
screen.addElement('password-input', new Input(true))
screen.addElement('done-btn', new Button("Done"))

screen.focus('username-input')

if (process.stdin.isTTY) process.stdin.setRawMode(true); // makes the terminal send stdin without the user pressing enter

process.stdin.on('keypress', (chunk, key) => {
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
    screen.render()
});
screen.render()