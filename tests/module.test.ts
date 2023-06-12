import fs from 'node:fs/promises'
import url from 'node:url'
import path from 'node:path'
import { test, expect, beforeAll } from 'vitest'

import { run, createServer } from '../src/index.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

beforeAll(async () => {
  await fs.rmdir(path.resolve(__dirname, '..', '.bin'))
})

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
