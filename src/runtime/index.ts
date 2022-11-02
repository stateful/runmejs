export async function loadWasm () {
  if (typeof process !== 'undefined' && process.version) {
    const runtime = await import('./node.js')
    return runtime.loadWasm()
  }

  if (typeof window !== 'undefined' && 'Deno' in window) {
    const runtime = await import('./deno.js')
    return runtime.loadWasm()
  }

  if (typeof window !== 'undefined') {
    throw new Error(`browser environment not yet supported`)
  }

  throw new Error(`No other environment supported yet`)
}
