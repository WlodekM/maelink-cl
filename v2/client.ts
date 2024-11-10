import { Screen } from "./screen.ts";
import type { Text } from "./elements.ts";
import strftime from "./strftime.js";

export let token: string;
export let account;
export const connection = new WebSocket("wss://api.meower.org/v0/cloudlink?v=1")

export let home: any[] = [];

let screen: Screen;

export function setScreen(screenN: Screen) {
    screen = screenN
}

export async function login(username: string, password: string) {
    screen.logs.push(`logging in as ${username}`)
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
    screen.logs.push(`got auth response (${authr.error ? "error" : "not error"})`)
    token = authr.token;
    account = authr.account;
    screen.logs.push(`Got token ${token}`);
    connection.addEventListener("message", (ev) => {
        const data = JSON.parse(ev.data.toString());
        screen.logs.push("INC: " + JSON.stringify(data))
        if(data.cmd != "post") return;
        home.push(data.val);
        const textHome: string[] = home.map(p => `[${strftime("%H:%M:%S")}] ${p.u}: ${p.p}`);
        const homeElem: Text = screen.elements.get("home") as Text;
        homeElem.text = textHome.join("\n")+"\n";
        screen.render()        
    })
}

export async function loadHome(screen: Screen) {
    home = (await (await fetch("https://api.meower.org/home")).json()).autoget.reverse();
    const textHome: string[] = home.map(p => `[${strftime("%H:%M:%S")}] ${p.u}: ${p.p}`);
    const homeElem: Text = screen.elements.get("home") as Text;
    homeElem.text = textHome.join("\n")+"\n";
    screen.logs.push("loadHome ran", home.length.toString())
    screen.render()
}

export async function sendHome(post:string) {
    screen.logs.push("sendHome ran", home.length.toString())
    fetch("https://api.meower.org/home", {
        method: "POST",
        headers: {
            token,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            content: post
        })
    }).then(async r=>screen.logs.push(`Got send response (${r.status} ${r.statusText}) ${await r.text()}`))
}
