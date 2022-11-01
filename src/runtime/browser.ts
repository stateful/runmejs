const runmeWASMUrl = 'http://localhost:8080/wasm/runme.wasm'
let runme: Promise<Response>
export async function loadWasm () {
  if (!runme) {
    runme = fetch(runmeWASMUrl)
  }
  return (await runme).arrayBuffer()
}
