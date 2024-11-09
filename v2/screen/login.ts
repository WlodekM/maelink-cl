import { ElemType } from "../screenbuilder.ts";
import { Screen } from "../screen.ts";
import * as client from "../client.ts"
import { build } from "../screenbuilder.ts";
import HomeScreen from "./home.ts";

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
            type: ElemType.ButtonElem,
            id: 'done-btn',
            data: ["Done", async function (this: Screen) {
                this.off()
                this.logs.push(`clicked button`)
                console.clear()
                console.log("logging in...")
                //@ts-ignore
                await client.login(this.elements.get("username-input").value, this.elements.get("password-input").value)
                build(HomeScreen);
                client
            }]
        }
    ],
    focus: "username-input",
    name: 'login'
}