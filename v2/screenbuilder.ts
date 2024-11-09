import { Screen } from "./screen.ts";
import * as elements from "./elements.ts";

export enum ElemType {
    TextElem,
    InputElem,
    ButtonElem,
}

const types = {
    0: elements.Text,
    1: elements.Input,
    2: elements.Button
}

type BuilderElem = {
    type: ElemType,
    id: string,
    data: any[]
}

export function build(data: {elements: BuilderElem[],focus?:string,name:string}) {
    const screen = new Screen(data.name);
    for (const element of data.elements) {
        //@ts-ignore
        screen.addElement(element.id, new types[element.type](...element.data))
    }
    if (data.focus) screen.focus(data.focus);
    screen.ready()
}