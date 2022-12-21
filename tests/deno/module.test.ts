import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts'

import { serialize, deserialize, Runme } from '../../mod.ts'
import { AST, MARKDOWN } from '../fixtures.ts'

Deno.test('deserialize', async () => {
  const cells: readonly Runme.Cell[] = AST
  assertEquals(await deserialize(MARKDOWN), cells)
})

Deno.test('serialize', async () => {
  const cells: readonly Runme.Cell[] = AST
  assertEquals(await serialize(cells), MARKDOWN)
})
