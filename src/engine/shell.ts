import { readLines, BufReader } from 'https://deno.land/std@0.79.0/io/bufio.ts'
import { sleep } from 'https://deno.land/x/sleep@v1.2.1/mod.ts'

import type { Engine } from './types.ts'

export class ShellEngine implements Engine {
    static supports = ['sh', 'shell', 'bash']

    #commandHistory: string[] = []
    #cwd: string
    #process: Deno.Process

    constructor (cwd: string) {
        this.#cwd = cwd
        this.#process = Deno.run({
            cwd: this.#cwd,
            cmd: [Deno.env.get('SHELL') || 'bash'],
            stderr: 'piped',
            stdout: 'piped',
            stdin: 'piped',
            env: Deno.env.toObject()
        })
    }

    async listen () {
        await Promise.all([
            this.#readStdout(),
            this.#readStderr(),
            this.#readStdin()
        ])
    }

    async #readStdout () {
        if (!this.#process.stdout) {
            return
        }

        for await (const line of readLines(this.#process.stdout)) {
            console.log(line)
        }
    }

    async #readStderr () {
        if (!this.#process.stderr) {
            return
        }

        for await (const line of readLines(this.#process.stderr)) {
            console.log(line)
        }
    }

    async #readStdin (): Promise<void> {
        if (!this.#process.stdin) {
            return
        }

        Deno.stdout.write(new TextEncoder().encode('> '))
        const input = await (new BufReader(Deno.stdin)).readLine()

        if (input) {
            const line = new TextDecoder().decode(input.line)
            this.#commandHistory.push(line)
            this.#process.stdin.write(input.line)
            this.#process.stdin.write(new TextEncoder().encode('\n'))
        }

        await sleep(0.01)
        return this.#readStdin()
    }
}
