import cp from 'node:child_process'

import { download } from './installer.js'

/**
 * run Runme CLI
 * @returns instance of spawned child process instance
 */
export async function runme () {
  const binaryPath = await download()
  const command = `${binaryPath} ${process.argv.slice(2).join(' ')}`
  const p = cp.spawn(command, {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      RUNME_PROJECT: ''
    }
  })
  return p.on('exit', (code) => process.exit(code ?? undefined))
}
