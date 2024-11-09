import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const username = await rl.question('Username: ');
const password = await rl.question('Password: ');

console.log("logging in as %s", username)

const authr = await (await fetch("https://api.meower.org/auth/login", {
    method: "POST",
    headers: {
        "content-type": "application/json"
    },
    body: JSON.stringify({
        username,
        password
    })
})).json();
let token = authr.token

console.log('got token', token)

rl.addListener('line', async (i) => {
    await fetch("https://api.meower.org/home", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            token
        },
        body: JSON.stringify({
            content: i
        })
    })
    // console.log("sent")
    rl.prompt("> ")
})

rl.prompt("> ")