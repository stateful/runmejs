import cp from 'node:child_process'

import { findConfig } from './utils.js'
import { download } from './installer.js'

const CLI_COMMANDS = ['completion', 'fmt', 'help', 'list', 'print', 'run', 'tui']

/**
 * run Runme CLI
 * @returns instance of spawned child process instance
 */
export async function runme () {
  const binaryPath = await download()
  const configFile: Record<string, unknown> = (await findConfig(process.cwd())) || {}
  const params = [
    ...Object.entries(configFile).map(([key, val]) => `--${key}=${val}`),
    ...process.argv.slice(2)
  ]

  /**
   * make run default argument
   */
  if (!CLI_COMMANDS.includes(params[0])) {
    params.unshift('run')
  }

  const command = `${binaryPath} ${params.join(' ')}`
  return cp.spawn(command, { stdio: 'inherit', shell: true, env: process.env })
}
