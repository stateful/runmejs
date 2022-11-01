export async function loadWasm () {
  if (typeof process !== 'undefined' && process.version) {
    const runtime = await import('./node.js')
    return runtime.loadWasm()
  }

  if (typeof window !== 'undefined' && 'Deno' in window) {
    // @ts-expect-error
    const runtime = await import('./deno.ts')
    return runtime.loadWasm()
  }

  if (typeof window !== 'undefined') {
    throw new Error(`browser environment not yet supported`)
  }

  throw new Error(`No other environment supported yet`)
}
