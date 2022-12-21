import fs from 'node:fs/promises'
import url from 'node:url'
import path from 'node:path'

export type { Runme } from '../types'

const dir = url.fileURLToPath(new URL('.', import.meta.url))
const runmeWASMPath = path.resolve(dir, '..', '..', 'wasm', 'runme.wasm')
let runme: Promise<Buffer>
export function loadWasm () {
  if (!runme) {
    runme = fs.readFile(runmeWASMPath)
  }
  return runme
}
