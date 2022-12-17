// @ts-ignore
import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts'

// @ts-ignore
import { serialize, deserialize } from '../../mod.ts'
// @ts-ignore
import { AST, MARKDOWN } from '../fixtures.ts'

// @ts-ignore
Deno.test('deserialize', async () => {
  assertEquals(await deserialize(MARKDOWN), AST)
})

// @ts-ignore
Deno.test('serialize', async () => {
  assertEquals(await serialize(AST), MARKDOWN)
})
