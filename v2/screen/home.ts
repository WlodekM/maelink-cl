import { ElemType } from "../screenbuilder.ts";
import { Screen } from "../screen.ts";
import * as client from "../client.ts"

export default {
    elements: [
        {
            type: ElemType.TextElem,
            id: 'home',
            data: ["Username: \n"]
        },
        {
            type: ElemType.InputElem,
            id: 'msg-input',
            data: [false, false]
        },
        {
            type: ElemType.ButtonElem,
            id: 'done-btn',
            data: ["Send", async function (this: Screen) {
                
            }]
        }
    ],
    focus: "msg-input",
    name: 'home'
}