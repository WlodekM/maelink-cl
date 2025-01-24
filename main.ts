// deno-lint-ignore-file no-process-globals
import LoginScreen from "./screen/login.ts";
import { build } from "./screenbuilder.ts";
import readline from 'node:readline';
import * as client from "./client.ts"

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true); // makes the terminal send stdin without the user pressing enter

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