class Log {
    time: number = Number(new Date());
    data: string = "";
    constructor (data: string, time?: number) {
        this.data = data;
        if(time) this.time = time;
    }
}

class Logger {
    logs: Log[] = [];

    constructor () {

    }

    log (data: string) {
        this.logs.push(new Log(data))
    }

    dump (): string[] {
        return this.logs.map(log => ``)
    }
}