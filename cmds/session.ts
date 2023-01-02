import { getEngineByLanguage } from '../src/engine/engine.ts'

export const description = 'Start a runme session.'
export const command = 'session <lang> [cwd]'
export const builder = {
    cwd: {
        alias: 'c',
        default: Deno.cwd()
    }
}

interface CommandParams {
    lang: string
    cwd: string
}

export const handler = async (argv: CommandParams) => {
    const engine = getEngineByLanguage(argv.lang, argv.cwd)
    await engine.listen()
}
