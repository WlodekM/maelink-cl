import { Screen } from "./screen.ts";
import * as elements from "./elements.ts";

export enum ElemType {
    TextElem,
    InputElem,
    ButtonElem,
    HR,
    BR
}

const types = {
    0: elements.Text,
    1: elements.Input,
    2: elements.Button,
    3: elements.HR,
    4: elements.BR
}

type BuilderElem = {
    type: ElemType,
    id: string,
    data?: any[],
}

type Data = {
    elements: BuilderElem[],
    focus?: string,
    name: string
    onload?: (screen: Screen) => any
}

export function build(data: Data) {
    const screen = new Screen(data.name);
    for (const element of data.elements) {
        if (!element.data) element.data = []
        //@ts-ignore
        screen.addElement(element.id, new types[element.type](...element.data))
    }
    if (data.focus) screen.focus(data.focus);
    screen.ready()
    if (data.onload) data.onload(screen)
}