import { ParsedCode } from '../mod.ts'
import { getAst, getFilePath } from './common.ts'

export const description = 'Print will display the details of the corresponding command block based on its name.'
export const command = 'print [id] <filename>'

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
     * ToDo(Christian): format data and table design
     */
    console.log(codeblock.value)
}
