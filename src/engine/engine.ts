import { ShellEngine } from "./shell.ts"
import type { Engine } from './types.ts'

export function getEngineByLanguage (lang: string, cwd: string): Engine {
    if (ShellEngine.supports.includes(lang)) {
        return new ShellEngine(cwd)
    }

    throw new Error(`Language "${lang}" not supported`)
}

export const SUPPORTED_LANGUAGES = [
    ...ShellEngine.supports
]
