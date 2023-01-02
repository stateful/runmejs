import { ParsedCode } from '../mod.ts'
import { getAst, getFilePath } from './common.ts'

export const description = 'Run a selected command identified based on its unique parsed name.'
export const aliases = ['run', 'exec']
export const command = 'run <id> [filename]'

interface CommandParams {
    filename: string
    id: string
}

export const handler = async (argv: CommandParams) => {
    const filePath = getFilePath(argv.filename)
    const codeblocks = await getAst(filePath)
    const codeblock = codeblocks.find((c) => (
        c.meta.id === argv.id
    ))

    if (!codeblock) {
        const availableIds = codeblocks
            .filter((c) => (c as ParsedCode).meta)
            .map((c) => (c as ParsedCode).meta.id)
        console.error(`Couldn't find code block id "${argv.id}" in ${filePath}, available: ${availableIds.join(', ')}`)
        Deno.exit(1)
    }

    /**
     * ToDo(Christian): replace with execution id
     */
    await Deno.run({
        cmd: ['bash', '-c', codeblock.value]
    })
}
