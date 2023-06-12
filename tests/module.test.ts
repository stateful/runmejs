import { test, expect, vi } from 'vitest'

import { run, createServer } from '../src/index.js'

vi.unmock('fs/promises')
vi.unmock('node:child_process')
vi.unmock('node:os')
vi.unmock('node:stream')
vi.unmock('node-fetch')

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
