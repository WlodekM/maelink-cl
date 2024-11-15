import { ElemType } from "../screenbuilder.ts";
import { Screen } from "../screen.ts";
import type { Input, Element, Text } from "../elements.ts";
import * as client from "../client.ts"

export default {
    elements: [
        {
            type: ElemType.TextElem,
            id: 'home',
            data: ["Loading home posts...\n", function (this: Text, text: string) {
                const msgInput: Input = this.screen.elements.get("msg-input") as Input;
                const inputValueHeight = msgInput.value.split("\n").length + 1;
                const termHeight = process.stdout.rows;
                const termWidth  = process.stdout.columns;

                let splitText = this.text.split("\n");
                splitText = splitText.map(t => t.replace(new RegExp(`([^]){${termWidth}}`, "g"),"$1\n"));
                splitText = splitText.join("\n").split("\n")

                splitText = splitText.slice(-(termHeight - inputValueHeight));

                return splitText.join("\n")
            }]
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