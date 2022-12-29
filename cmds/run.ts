import { join } from 'https://deno.land/std@0.170.0/path/mod.ts'
import { serialize } from '../mod.ts'

export const description = 'Run a selected command identified based on its unique parsed name.'
export const aliases = ['run', 'exec']
export const command = 'run [filename]'

interface CommandParams {
    filename: string
}

export const handler = async (argv: CommandParams) => {
    const filePath = join(Deno.cwd(), argv.filename)
    const fileContent = await Deno.readTextFile(filePath)
    console.log(await serialize(fileContent))
}
