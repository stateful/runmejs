import { loadWasm } from './runtime/index.js'
import type { ParsedDocument } from './types'

import './wasm/wasm_exec.js'

declare global {
  var Go: new () => any
  var GetDocument: (md: string) => ParsedDocument
}

const go = new globalThis.Go()
let wasm: WebAssembly.WebAssemblyInstantiatedSource

async function initWasm () {
  /**
   * check if already initiated
   */
  if (typeof globalThis['GetDocument'] === 'function') {
    return
  }

  const wasmBuffer = await loadWasm()
  if (!wasm) {
    wasm = await WebAssembly.instantiate(wasmBuffer, go.importObject)
  }

  /**
   * listen on process exit to avoid deadlock
   */
  const initPromise = process.on && new Promise((resolve) => process.on('exit', resolve))
  go.run(wasm.instance)
  await initPromise
}

export default async function parse (content: string) {
  await initWasm()

  const { document } = await globalThis.GetDocument(content)
  return document
}
