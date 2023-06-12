import cp, { type SpawnOptions } from 'node:child_process'

import { findAllCommand } from './utils.js'
import { run } from './index.js'
import { download } from './installer.js'

const CLI_COMMANDS = ['completion', 'fmt', 'help', 'list', 'print', 'run', 'tui']

/**
 * run Runme CLI
 * @returns instance of spawned child process instance
 */
export async function runme () {
  const binaryPath = await download()
  const command = `${binaryPath} ${process.argv.slice(2).join(' ')}`
  const p = cp.spawn(command, { stdio: 'inherit', shell: true, env: process.env })
  return p.on('exit', (code) => process.exit(code ?? undefined))
}
