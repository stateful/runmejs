import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts'

import parse from '../../dist/index.js'

Deno.test("hello world #1", async () => {
  assertEquals(await parse('# Hello World\n'), [
    { markdown: '# Hello World' }
  ])
})
