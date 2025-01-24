// deno-lint-ignore-file no-explicit-any
import Maelink from "./mljs/main.ts";
import { Screen } from "./screen.ts";
import type { Text } from "./elements.ts";
import strftime from "./strftime.js";

export const maelink = new Maelink()
export let token: string;
export const connection = maelink.ws
console.debug('ass')

maelink.ws.onopen = () => {
    console.debug('open')
}

export const home: any[] = [];

let screen: Screen;

export function setScreen(screenN: Screen) {
    screen = screenN
    // console.log(screen)
}

interface Post {
    _id: string,
    p: string,
    u: string,
    e: string,
    reply_to: null | string,
    post_id: string
}

maelink.on('message', (e) => {
    console.debug(e)
    screen.logs.push("INC: " + e)
})

maelink.on("post", (post: Post) => {
    console.debug('assss')
    screen.logs.push("POST: " + JSON.stringify(post))
    home.push(post);
    console.debug(post, 'uh', home)
    const textHome: string[] = home.map(p => `[${strftime("%H:%M:%S", new Date(Number(JSON.parse(p.e).t) * 1000))}] ${p.u}: ${p.p}`);
    const homeElem: Text = screen.elements.get("home") as Text;
    console.debug(homeElem, screen)
    if(homeElem) homeElem.text = textHome.join("\n")+"\n";
    screen.render()        
})

export async function login(username: string, password: string) {
    screen.logs.push(`logging in as ${username}`)
    const authr = await maelink.login(username, password)
    screen.logs.push(`got auth response (${authr.error ? "error" : "not error"})`)
    token = authr.token;
    screen.logs.push(`Got token ${token}`);
}

export async function loadHome(screen: Screen) {
    const homef = (await maelink.fetchMessages(0)).reverse()
    home.push(...homef)
    const textHome: string[] = home.map(p => {
        return `[${strftime("%H:%M:%S", new Date(Number(JSON.parse(p.e).t) * 1000))}] ${p.u}: ${p.p}`
    });
    const homeElem: Text = screen.elements.get("home") as Text;
    homeElem.text = textHome.join("\n")+"\n";
    screen.logs.push("loadHome ran", home.length.toString())
    screen.render()
}

export function sendHome(post:string) {
    screen.logs.push("sendHome ran", home.length.toString())
    maelink.sendMessage(post)
    // fetch("https://api.meower.org/home", {
    //     method: "POST",
    //     headers: {
    //         token,
    //         "content-type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         content: post
    //     })
    // }).then(async r=>screen.logs.push(`Got send response (${r.status} ${r.statusText}) ${await r.text()}`))
}
