import { test, afterAll, expect } from 'vitest'

import parse from '../../src/index.js'

test('can import and use the package', async () => {
  expect(await parse('# Hello World\n')).toEqual([
    { markdown: '# Hello World' }
  ])
})
