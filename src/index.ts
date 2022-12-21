import { loadWasm, Runme } from './runtime/node.js'

import './wasm/wasm_exec.js'

declare var globalThis: any

const go = new globalThis.Go()
let wasm: WebAssembly.WebAssemblyInstantiatedSource

async function initWasm () {
  /**
   * check if already initiated
   */
  if (globalThis.Runme) {
    return globalThis.Runme as Runme.Serializer['Runme']
  }

  const wasmBuffer = await loadWasm()
  if (!wasm) {
    wasm = await WebAssembly.instantiate(wasmBuffer, go.importObject)
  }

  /**
   * listen on process exit to avoid deadlock
   */
  const proc = globalThis.process
  const initPromise = proc.on && new Promise((resolve) => proc.on('exit', resolve))
  go.run(wasm.instance)

  /**
   * in some sitations `globalThis.GetDocument` is undefined and we need to wait for
   * the deadlock to happen
   */
  if (typeof globalThis.Runme === 'undefined') {
    await initPromise
  }

  const { Runme } = globalThis as Runme.Serializer
  return Runme
}

/**
 * Deserializes the file context of a markdown document into an AST abstraction
 * @param content  content of markdown file
 * @returns        AST abstraction
 */
export async function deserialize (content: string) {
  const Runme = await initWasm()
  const { cells } = await Runme.deserialize(content)
  return cells
}

/**
 * Serializes an AST abstraction of a markdown document into a string
 * @param content  AST abstraction
 * @returns        markdown content as string
 */
export async function serialize (cells: readonly Runme.Cell[]) {
  const Runme = await initWasm()
  return await Runme.serialize(JSON.stringify({ cells }))
}
