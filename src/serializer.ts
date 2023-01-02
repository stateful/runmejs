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
    let i = -1
    for (const child of ast.children) {
        /**
         * we don't apply metadata to non code cells
         */
        if (child.type !== 'code') {
            continue
        }

        ++i
        child.meta = parseMetadata(child.meta, i) as any
    }

    return ast as RunmeRoot
}

function parseMetadata (meta: Code['meta'], i: number): Metadata {
    const defaultMetadata: Metadata = {
        ...METADATA_DEFAULTS as Metadata,
        /**
         * ToDo(Christian): implement better id generator, see
         * https://github.com/stateful/runme/blob/11d6a8d019c637e986b5a8118617244a383b03f4/internal/document/block.go#L201
         */
        id: `codeblock-${i}`
    }

    if (typeof meta !== 'string') {
        return defaultMetadata
    }

    const parsedMetadata: Metadata = meta
        .trim()
        .split(',')
        .reduce((prev: Metadata, entry: string) => {
            const [key, val] = entry.split('=') as [keyof Metadata, string]
            // @ts-expect-error
            prev[key] = typeof METADATA_DEFAULTS[key as keyof Metadata] === 'boolean'
                ? TRUETHY_VALUES.includes(val)
                : typeof METADATA_DEFAULTS[key as keyof Metadata] === 'number'
                    ? parseInt(val, 10)
                    : val
            return prev
        }, defaultMetadata)

    return parsedMetadata
}
