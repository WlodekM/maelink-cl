import { Screen } from "./screen.ts";

export let token: string;
export let account;

let screen: Screen;

export function setScreen(screenN: Screen) {
    screen = screenN
}

export async function login(username: string, password: string) {
    const authr = await (await fetch("https://api.meower.org/auth/login", {
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    })).json();

    token = authr.token;
    account = authr.account
}

export async function loadHome() {
    const home = (await (await fetch("https://api.meower.org/home")).json()).autoget;
    
}