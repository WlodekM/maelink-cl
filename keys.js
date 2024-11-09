import readline from 'node:readline';

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on('keypress', (chunk, key) => {
    console.log(JSON.stringify(key))
    process.exit();
});