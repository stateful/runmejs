import { unified } from 'npm:unified'
import remarkParse from 'npm:remark-parse'
import remarkGfm, { Root } from "https://esm.sh/remark-gfm@3.0.1"
import type { Code } from 'https://esm.sh/v102/@types/mdast@3.0.10/index.d.ts'

import { METADATA_DEFAULTS } from './constants.ts'
import { Metadata, RunmeRoot } from './types.ts'

const TRUETHY_VALUES = ['1', 'true']

export async function serialize (content: string) {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .parse(content)
    return sanitize(file)
}

function sanitize (ast: Root): RunmeRoot {
    const root: RunmeRoot = { children: [] }
    for (const child of ast.children) {
        /**
         * we don't apply metadata to non code cells
         */
        if (child.type !== 'code') {
            continue
        }

        const id = generateCodeBlockName(child.value)
        root.children.push({
            ...child,
            meta: parseMetadata(child.meta, id)
        })
    }

    return root
}

function parseMetadata (meta: Code['meta'], id: string): Metadata {
    const defaultMetadata: Metadata = {
        ...METADATA_DEFAULTS as Metadata,
        id
    }

    if (typeof meta !== 'string') {
        return defaultMetadata
    }

    const parsedMetadata: Metadata = meta
        .trim()
        .split(',')
        .reduce((prev: Metadata, entry: string) => {
            const [key, val] = entry.split('=') as [keyof Metadata, string]
            // @ts-expect-error need type fix
            prev[key] = typeof METADATA_DEFAULTS[key as keyof Metadata] === 'boolean'
                ? TRUETHY_VALUES.includes(val)
                : typeof METADATA_DEFAULTS[key as keyof Metadata] === 'number'
                    ? parseInt(val, 10)
                    : val
            return prev
        }, defaultMetadata)

    return parsedMetadata
}

const createdNames: string[] = []
function generateCodeBlockName (code: string) {
    code = code.slice(0, 32)
    const fragments = code.split(' ')
    code = fragments.length > 1
        ? fragments.slice(0, 3).join(' ')
        : fragments[0]

    let name = ''
    for (let char of code.split('')) {
        char = char.toLowerCase()
        if (char === ' ' && name.length > 0) {
            name += '-'
        } else if ((char >= '0' && char <= '9') || (char >= 'a' && char <= 'z')) {
            name += char
        }
    }

    if (createdNames.includes(name)) {
        createdNames.push(name)
        return `${name}-${createdNames.length - Array.from(new Set(createdNames)).length}`
    }

    createdNames.push(name)
    return name
}
