import { ElemType } from "../screenbuilder.ts";
import { Screen } from "../screen.ts";
import type { Input } from "../elements.ts";
import * as client from "../client.ts"

export default {
    elements: [
        {
            type: ElemType.TextElem,
            id: 'home',
            data: ["Loading home posts...\n"]
        },
        {
            type: ElemType.HR,
            id: 'hr',
            data: []
        },
        {
            type: ElemType.InputElem,
            id: 'msg-input',
            data: [false, false, true]
        },
        {
            type: ElemType.ButtonElem,
            id: 'done-btn',
            data: ["Send", async function (this: Screen) {
                const msgInput: Input = this.elements.get('msg-input') as Input
                client.sendHome(msgInput.value);
                msgInput.value = ""
                this.render()
            }]
        }
    ],
    focus: "msg-input",
    name: 'home',
    onload (screen: Screen) {
        client.setScreen(screen)
        client.loadHome(screen)
    }
}