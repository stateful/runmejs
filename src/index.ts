import { loadWasm } from './runtime/node.js'
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
  if (typeof globalThis.GetDocument === 'function') {
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

  /**
   * in some sitations `globalThis.GetDocument` is undefined and we need to wait for
   * the deadlock to happen
   */
  if (typeof globalThis.GetDocument === 'undefined') {
    await initPromise
  }
}

export async function parse (content: string) {
  await initWasm()

  const { document } = await globalThis.GetDocument(content)
  return document
}
