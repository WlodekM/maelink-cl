// deno-lint-ignore-file no-process-globals
import LoginScreen from "./screen/login.ts";
import { build } from "./screenbuilder.ts";
import readline from 'node:readline';
import * as client from "./client.ts"

function changeTitle(title: string) {
    if (process.platform == 'win32') {
        process.title = title;
    } else {
        process.stdout.write(`\x1b]2;${title}\x1b\x5c`);
    }
}

readline.emitKeypressEvents(process.stdin);

export type Client = typeof client

if (process.stdin.isTTY) process.stdin.setRawMode(true); // makes the terminal send stdin without the user pressing enter

changeTitle(`maelink`)

let screen;
try {
    screen = build(LoginScreen, client);
    client.setScreen(screen)
} catch (error) {
    console.error(error);
    for (const log of screen?.logs ?? []) {
        console.log(log)
    }
}