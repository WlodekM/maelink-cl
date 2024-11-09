import { ElemType } from "../screenbuilder.ts";

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
            data: ["Done"]
        }
    ],
    focus: "username-input",
    name: 'login'
}