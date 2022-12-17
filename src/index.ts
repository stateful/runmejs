import { loadWasm } from './runtime/node.js'
import type { Serializer } from './types'

import './wasm/wasm_exec.js'

declare var globalThis: any

const go = new globalThis.Go()
let wasm: WebAssembly.WebAssemblyInstantiatedSource

async function initWasm () {
  /**
   * check if already initiated
   */
  if (globalThis.Runme) {
    return globalThis.Runme as Serializer['Runme']
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
  if (typeof globalThis.Runme === 'undefined') {
    await initPromise
  }

  const { Runme } = globalThis as Serializer
  return Runme
}

export async function parse (content: string) {
  const Runme = await initWasm()

  const { cells } = await Runme.deserialize(content)
  return cells
}
