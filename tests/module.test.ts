import { test, expect } from 'vitest'

import { run, createServer } from '../src/index.js'

test('run', async () => {
  expect(await run(['helloWorld']))
    .toMatchSnapshot()
  expect(await run(['fail'], { ignoreReturnCode: true }))
    .toMatchSnapshot()
})

test('createServer', async () => {
  const server = await createServer()
  expect(await run(['export', 'print'], { server }))
    .toMatchSnapshot()
  server.kill()
})
