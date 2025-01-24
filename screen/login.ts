import { ElemType } from "../screenbuilder.ts";
import { Screen } from "../screen.ts";
import { build } from "../screenbuilder.ts";
import HomeScreen from "./home.ts";
import { Input } from "../elements.ts";
import process from "node:process"

function changeTitle(title: string) {
    if (process.platform == 'win32') {
        process.title = title;
    } else {
        process.stdout.write(`\x1b]2;${title}\x1b\x5c`);
    }
}

export default {
    elements: [
        {
            type: ElemType.TextElem,
            id: 'username-label',
            data: ["Username: \n"]
        },
        {
            type: ElemType.InputElem,
            id: 'username-input',
            data: [false]
        },
        {
            type: ElemType.BR,
            id: 'naoiuou'
        },
        {
            type: ElemType.TextElem,
            id: 'password-label',
            data: ["Password: \n"]
        },
        {
            type: ElemType.InputElem,
            id: 'password-input',
            data: [true]
        },
        {
            type: ElemType.BR,
            id: 'faij0ifsj'
        },
        {
            type: ElemType.ButtonElem,
            id: 'done-btn',
            data: ["Done", async function (this: Screen) {
                this.client.setScreen(this)
                this.off()
                this.logs.push(`clicked button`)
                console.clear()
                changeTitle('maelink - logging in...')
                this.logs.push("logging in...")
                const usernameInput = this.elements.get("username-input") as Input;
                const passwordInput = this.elements.get("password-input") as Input;
                await this.client.login(usernameInput.value, passwordInput.value)
                changeTitle('maelink - logged in as ' + usernameInput.value)
                build(HomeScreen, this.client);
                this.client
            }]
        }
    ],
    focus: "username-input",
    name: 'login',
    onload() {
        changeTitle(`maelink - log in`)
    }
}