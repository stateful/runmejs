// @ts-expect-error Deno
import { resolve } from 'https://deno.land/std/path/mod.ts'

const __dirname = new URL('.', import.meta.url).pathname
const runmeWASMPath = resolve(__dirname, '..', '..', 'wasm', 'runme.wasm')
let runme: Promise<Buffer>
export function loadWasm () {
  if (!runme) {
    // @ts-expect-error Deno
    runme = Deno.readFile(runmeWASMPath)
  }
  return runme
}
