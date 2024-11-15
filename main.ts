// deno-lint-ignore-file no-process-globals
import LoginScreen from "./screen/login.ts";
import { build } from "./screenbuilder.ts";
import readline from 'node:readline';

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true); // makes the terminal send stdin without the user pressing enter

build(LoginScreen)