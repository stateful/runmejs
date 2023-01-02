import { join } from 'https://deno.land/std@0.170.0/path/mod.ts'
import { basename } from 'https://deno.land/std@0.170.0/path/mod.ts'
import { serialize } from '../mod.ts'

export const DEFAULT_FILENAME = 'README.md'

export function getFilePath (filePath?: string) {
    return join(Deno.cwd(), filePath || DEFAULT_FILENAME)
}

export async function verifyFileExists (filePath: string): Promise<void> {
    try {
        await Deno.stat(filePath);
    } catch {
        throw new Error('File not found')
    }
}

export async function getAst (filePath: string) {
    try {
        await verifyFileExists(filePath)

        const fileContent = await Deno.readTextFile(filePath)
        const ast = await serialize(fileContent)
        return ast
    } catch (err: unknown) {
        console.error(`Failed parsing ${basename(filePath)}: ${(err as Error).message}`)
        Deno.exit(1)
    }
}
