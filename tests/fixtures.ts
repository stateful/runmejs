export const AST = [{
    kind: 1,
    languageId: '',
    value: '# Hello World',
},
{
    kind: 2,
    languageId: 'sh',
    metadata: {
        'runme.dev/name': 'echo-hello',
    },
    value: 'echo "Hello World"',
}] as const

export const MARKDOWN = (
    '# Hello World\n' +
    '\n' +
    '```sh\n' +
    'echo "Hello World"\n' +
    '```\n'
)
