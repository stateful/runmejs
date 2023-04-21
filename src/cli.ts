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
  return cp.spawn(command, { stdio: 'inherit', shell: true, env: process.env })
}

/**
 * run new Runme CLI (experimental)
 */
export async function runme2 () {
  const spawnOpts: SpawnOptions = { stdio: 'inherit', shell: true, env: process.env }
  const params = process.argv.slice(2)
  const flags = params.filter((p) => p.startsWith('-'))
  const ids = params.filter((p) => !p.startsWith('-'))

  // ToDo(Christian): use yargs
  const runParallel = flags.includes('--parallel') || flags.includes('-p')
  const commands = await findAllCommand()

  /**
   * mimick list command
   */
  if (ids.length === 1 && (ids[0] === 'list' || ids[0] === 'ls')) {
    return console.table(commands.map(([file, cmd]) => [file.replace(process.cwd(), ''), cmd]))
  }

  if (runParallel) {
    return Promise.all(ids.map((id) => runById(id, commands)))
  }

  for (const id of ids) {
    await runById(id, commands)
  }
}

function runById (id: string, commands: string[][]) {
  const [file] = commands.find(([, cmdId]) => cmdId === id) || []

  if (!file) {
    throw new Error(`Runme cell with id "${id}" not found`)
  }

  return run(file, id)
}
