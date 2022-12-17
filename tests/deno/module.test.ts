// @ts-ignore
import { assertEquals, assertSma } from 'https://deno.land/std@0.161.0/testing/asserts.ts'

// @ts-ignore
import { parse } from '../../mod.ts'

// @ts-ignore
Deno.test("can import and use the package", async () => {
  assertEquals(await parse('# Hello World\n```sh\necho "Hello World"\n```'), [{
    kind: 1,
    languageId: "",
    value: "# Hello World",
  }, {
    kind: 2,
    languageId: "sh",
    metadata: {
      "runme.dev/name": "echo-hello",
    },
    value: 'echo "Hello World"',
  }])
})
