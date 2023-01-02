import Table from 'npm:cli-table3'

import { getAst, getFilePath } from './common.ts'

export const description = 'Displays list of parsed command blocks, their name, number of commands in a block, and description from a given markdown file, such as README.md.'
export const aliases = ['list', 'ls']
export const command = 'list [filename]'

interface CommandParams {
    filename: string
}

export const handler = async (argv: CommandParams) => {
    const filePath = getFilePath(argv.filename)
    const codeblocks = await getAst(filePath)

    if (codeblocks.length === 0) {
        return console.error(`No codeblocks found in ${filePath}`)
    }

    /**
     * ToDo(Christian): format data and table design
     */
    const table = new Table({
        head: ['#', 'Name', 'Code', 'Annotations'],
        chars: {
            'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
            'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': '',
            'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': '',
            'right': '' , 'right-mid': '' , 'middle': ' '
        },
        style: { 'padding-left': 0, 'padding-right': 2 }
      });

    table.push(...codeblocks.map((block, i) => [
        i,
        block.meta.name || block.meta.id,
        block.value
            .split('\n').
            filter(Boolean)
            .slice(0, 5)
            .join('\n'),
        Object.entries(block.meta)
            .filter(([key,]) => key !== 'id')
            .map(([key, value]) => (
                typeof value === 'boolean'
                    ? `[${value ? 'x' : ' '}] ${key}`
                    : `${key}: ${value}`
            ))
            .join(', ')
    ]))

    console.log(table.toString())
}
