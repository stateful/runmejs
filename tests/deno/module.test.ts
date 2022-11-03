// @ts-ignore
import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts'

// @ts-ignore
import { parse } from '../../mod.ts'

// @ts-ignore
Deno.test("can import and use the package", async () => {
  assertEquals(await parse('# Hello World\n'), [
    { markdown: '# Hello World' }
  ])
})
