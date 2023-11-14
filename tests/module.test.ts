import fs from 'node:fs/promises'
import url from 'node:url'
import path from 'node:path'
import { test, expect, beforeAll } from 'vitest'

import { run, createServer } from '../src/index.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// reliable snapshots x-platform and node versions
function toJsonSnapshot(obj: any) {
  return JSON.stringify(obj, null, 1)
}

beforeAll(async () => {
  await fs.rm(
    path.resolve(__dirname, '..', '.bin'),
    { recursive: true, force: true }
  )
})

test('run', async () => {
  expect(toJsonSnapshot(await run(['helloWorld'])))
    .toMatchSnapshot()
  expect(toJsonSnapshot(await run(['fail'], { ignoreReturnCode: true })))
    .toMatchSnapshot()
})

test('createServer', async () => {
  const server = await createServer()
  expect(toJsonSnapshot(await run(['export', 'print'], { server })))
    .toMatchSnapshot()
  server.kill()
})
