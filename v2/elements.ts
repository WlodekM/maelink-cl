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
    onkeypres(key: Key): void {};
}

export class Text extends Element {
    text: string;
    constructor(text: string) {
        super();
        this.text = text;
    }
    render() {
        process.stdout.write(this.text)
    }
}

export class Input extends Element {
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

export class Button extends Text {
    focusable: boolean = true;
    constructor (text: string) {
        super(text)
    }
    render(): void {
        console.log(`(${(this.focused ? chalk.bgWhite : (a:string)=>a)(this.text)})`)
    }
}
