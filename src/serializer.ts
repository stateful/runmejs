import { unified } from 'npm:unified'
import remarkParse from 'npm:remark-parse'
import remarkGfm from 'https://esm.sh/remark-gfm@3'

export async function serialize (content: string) {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .parse(content)
    return file
}
