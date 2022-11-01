import fsImport from 'node:fs/promises'
import urlImport from 'node:url'
import pathImport from 'node:path'

/**
 * export built in modules
 */
export const fs = fsImport
export const url = urlImport
export const path = pathImport

const dir = url.fileURLToPath(new URL('.', import.meta.url))
const runmeWASMPath = path.resolve(dir, '..', '..', 'wasm', 'runme.wasm')
let runme: Promise<Buffer>
export function loadWasm () {
  if (!runme) {
    runme = fs.readFile(runmeWASMPath)
  }
  return runme
}
