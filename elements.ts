// deno-lint-ignore-file no-case-declarations ban-ts-comment no-process-globals
import chalk from "chalk";
import { type Key } from 'node:readline';
import { type Screen } from "./screen.ts";

export abstract class Element {
    focusable: boolean = false;
    focused: boolean = false;
    // screen property is asigned by the addElement function of Scren
    //@ts-ignore
    screen: Screen;
    abstract render(): void;
    onkeypres(_key: Key): void {};
}

export class Text extends Element {
    text: string;

    processText: (text: string) => string;

    constructor(text: string, processText = (t:string)=>t) {
        super();
        this.text = text;
        this.processText = processText
    }
    render() {
        process.stdout.write(this.processText(this.text))
    }
}

export class HR extends Element {
    constructor() {
        super()
    }
    render(): void {
        console.log('-'.repeat(process.stdout.columns))
    }
}

export class BR extends Element {
    constructor() {
        super()
    }
    render(): void {
        console.log()
    }
}

export class Input extends Element {
    override focusable: boolean = true;
    value: string = "";

    textarea = false;
    br = false;

    isPassword: boolean = false;

    render(): void {
        let text = this.value
        if (this.isPassword) text = text.replace(/[^]/g, '*');
        if (this.focused) text += "_"
        process.stdout.write(text)
    }

    override onkeypres(key: Key): void {
        //@ts-ignore
        if (key.meta || key.code || ["return", "backspace"].includes(key.name)) {
            switch (key.name) {
                case "return":
                    if(this.textarea) {
                        this.value += '\n'
                        break;
                    }
                    this.focused = false;
                    const focusableIDs = Object.keys(this.screen.getFocusable());
                    const focusedIndex = focusableIDs.indexOf(this.screen.focusedElementId);
                    this.screen.focus(focusableIDs[(focusedIndex + 1) % focusableIDs.length]);
                    break;
                
                case "backspace":
                    const prevValue = '' + this.value
                    // logs.push(`doing backspace : before ${prevValue}, after ${prevValue.substring(0, prevValue.length - 1)} : 0-${prevValue.length - 1}`)
                    this.value = prevValue.substring(0, prevValue.length - 1)
                    break;
            }
            this.screen.render()
            return;
        }
	// check if the character ism't typable
	// checks:
	// sequience length > 1 (eg ^[ ^[[A)
	// key name != sequence (and if name exists)
        //@ts-ignore
        if (!key.sequence || key.sequence.length > 1 || key.name != key.sequence?.toLowerCase() && !["space"].includes(key.name) && key.name) return;
        this.value += key.sequence;
        this.screen.render()
    }

    constructor(isPassword: boolean = false, br: boolean = false, textarea: boolean = false) {
        super()
        this.br = br
        this.isPassword = isPassword;
        this.textarea = textarea;
    }
}

export class Button extends Text {
    override focusable: boolean = true;
    onclick: ()=>void;
    constructor (text: string, onclick=()=>{}) {
        super(text);
        this.onclick = onclick
    }

    override render(): void {
        process.stdout.write(`(${(this.focused ? chalk.bgWhite : (a:string)=>a)(this.text)})`)
    }

    override onkeypres(key: Key): void {
        //@ts-ignore
        if (["return", "space"].includes(key.name)) {
            this.onclick.call(this.screen)
        }
    }
}
