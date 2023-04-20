import cp, { type SpawnOptions } from 'node:child_process'

import { findConfig, asyncSpawn } from './utils.js'
import { download } from './installer.js'

const CLI_COMMANDS = ['completion', 'fmt', 'help', 'list', 'print', 'run', 'tui']

/**
 * run Runme CLI
 * @returns instance of spawned child process instance
 */
export async function runme () {
  const spawnOpts: SpawnOptions = { stdio: 'inherit', shell: true, env: process.env }
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

  /**
   * check if more than one markdown cell id was provided
   */
  const paramArgs = params.filter((p) => !p.startsWith('--'))
  const flags = params.filter((p) => p.startsWith('--'))
  if (paramArgs.includes('run') && paramArgs.length > 2) {
    const ids = paramArgs.filter((p) => p !== 'run')
    for (const id of ids) {
      await asyncSpawn(`${binaryPath} run ${id} ${flags.join(' ')}`, spawnOpts)
    }
    return
  }

  const command = `${binaryPath} ${params.join(' ')}`
  return cp.spawn(command, spawnOpts)
}
