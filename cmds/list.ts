import { ParsedCode } from '../mod.ts'
import { getAst, getFilePath } from './common.ts'

export const description = 'Displays list of parsed command blocks, their name, number of commands in a block, and description from a given markdown file, such as README.md.'
export const aliases = ['list', 'ls']
export const command = 'list [filename]'

interface CommandParams {
    filename: string
}

export const handler = async (argv: CommandParams) => {
    const filePath = getFilePath(argv.filename)
    const ast = await getAst(filePath)
    const codeblocks = ast.children.filter(
        (c) => c.type === 'code') as ParsedCode[]

    if (codeblocks.length === 0) {
        return console.error(`No codeblocks found in ${filePath}`)
    }

    /**
     * ToDo(Christian): format data and table design
     */
    console.table(codeblocks)
}
