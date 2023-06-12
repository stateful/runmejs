import { test, expect, vi, beforeAll } from 'vitest'
import os from 'node:os'

beforeAll(() => {
  vi.restoreAllMocks()
  vi.unmock('node:os')
  vi.unmock('node:fs')
  vi.unmock('node:child_process')
  console.log(os.platform());

})

test('run', async () => {
  const { run } = await import('../src/index.js')
  expect(await run(['helloWorld']))
    .toMatchSnapshot()
  expect(await run(['fail'], { ignoreReturnCode: true }))
    .toMatchSnapshot()
})

test('createServer', async () => {
  const { createServer } = await import('../src/index.js')
  const server = await createServer()
  expect(await run(['export', 'print'], { server }))
    .toMatchSnapshot()
  server.kill()
})
