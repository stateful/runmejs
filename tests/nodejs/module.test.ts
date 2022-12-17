import { test, expect } from 'vitest'

import { deserialize, serialize } from '../../src/index.js'
import { AST, MARKDOWN } from '../fixtures'

test('deserialize', async () => {
  expect(await deserialize(MARKDOWN)).toEqual(AST)
})

test('serialize', async () => {
  expect(await serialize(AST)).toBe(MARKDOWN)
})
