import { resolve } from 'https://deno.land/std/path/mod.ts'

export type { Runme } from '../types.ts'

const __dirname = new URL('.', import.meta.url).pathname
const runmeWASMPath = resolve(__dirname, '..', '..', 'wasm', 'runme.wasm')
let runme: Promise<Uint8Array>
export function loadWasm () {
  if (!runme) {
    runme = Deno.readFile(runmeWASMPath)
  }
  return runme
}
