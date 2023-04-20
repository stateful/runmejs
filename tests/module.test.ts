import { test, expect } from 'vitest'

import { run, runSeries, runParallel, createServer } from '../src/index.js'

test('run', async () => {
  expect(await run('./examples/example.md', 'helloWorld'))
    .toMatchSnapshot()
  expect(await run('./examples/example.md', 'fail', { ignoreReturnCode: true }))
    .toMatchSnapshot()
})

test('runSeries', async () => {
  expect(await runSeries('./examples/example.md', ['helloWorld', 'export', 'print']))
    .toMatchSnapshot()
})

test('runParallel', async () => {
  expect(await runParallel('./examples/example.md', ['helloWorld', 'export', 'print']))
    .toMatchSnapshot()
})

test('createServer', async () => {
  const server = await createServer()
  expect(await runSeries('./examples/example.md', ['export', 'print'], { server }))
    .toMatchSnapshot()
  server.kill()
})
