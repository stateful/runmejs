import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts'

import parse from '../../dist/index.js'

Deno.test("can import and use the package", async () => {
  assertEquals(await parse('# Hello World\n'), [
    { markdown: '# Hello World' }
  ])
})
