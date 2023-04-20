import path from 'node:path'
import cp, { ChildProcess } from 'node:child_process'

import getPort from 'get-port'
import waitOn from 'wait-on'
import { exec } from '@actions/exec'

import { hasAccess, findConfig, RunmeStream } from './utils.js'
import { download } from './installer.js'
import type { RunArgs, GlobalArgs, RunmeResult } from './types'

/**
 * Run a selected command
 * @param {string}   markdownFilePath  path to markdown file
 * @param {string}   id                name of cells to run
 * @param {RunArgs}  args              execution arguments
 * @returns {RunmeResult[]}
 */
export async function run (markdownFilePath: string, id: string, runArgs: RunArgs = {}): Promise<RunmeResult> {
  const configFile = (await findConfig(process.cwd())) || {} as RunArgs
  const args = { ...configFile, ...runArgs }
  const runmePath = await download(args.version)
  const absoluteMarkdownPath = path.resolve(process.cwd(), markdownFilePath)

  if (typeof id !== 'string') {
    throw new Error('Command has no cell id defined to execute')
  }

  if (!(await hasAccess(absoluteMarkdownPath))) {
    throw new Error(`Can't find or don't have access to ${absoluteMarkdownPath}`)
  }

  const execArgs = [
    'run',
    id,
    `--chdir=${path.dirname(absoluteMarkdownPath)}`,
    `--filename=${path.basename(absoluteMarkdownPath)}`
  ]

  if (typeof args.server === 'string') {
    execArgs.push(`--server=${args.server}`)
  }
  const spawnargs = args.server && (args.server as ChildProcess).spawnargs
  if (spawnargs && spawnargs.lastIndexOf('--address') > -1) {
    const serverAddress = spawnargs[spawnargs.lastIndexOf('--address') + 1]
    execArgs.push(`--server=${serverAddress}`)
  }

  const outStream = new RunmeStream()
  outStream.pipe(args.outStream || process.stdout).pipe
  const errStream = new RunmeStream()
  errStream.pipe(args.errStream || process.stderr)
  const exitCode = await exec(runmePath, execArgs, {
    ...args,
    outStream,
    errStream
  })

  return {
    exitCode,
    stdout: outStream.toString(),
    stderr: errStream.toString()
  }
}

/**
 * Run set of markdown cells in series
 * @param {string}   markdownFilePath  path to markdown file
 * @param {string[]} ids               name of cells to run
 * @param {RunArgs}  args               execution arguments
 * @returns {RunmeResult[]}
 */
export async function runSeries (markdownFilePath: string, ids: string[], args: RunArgs = {}): Promise<RunmeResult[]> {
  const result: RunmeResult[] = []
  for (const id of ids) {
    result.push(await run(markdownFilePath, id, args))
  }
  return result
}

/**
 * Run set of markdown cells in parallel
 * @param {string}   markdownFilePath  path to markdown file
 * @param {string[]} ids               name of cells to run
 * @param {RunArgs}  args               execution arguments
 * @returns {RunmeResult[]}
 */
export async function runParallel (markdownFilePath: string, ids: string[], args: RunArgs = {}): Promise<RunmeResult[]> {
  return Promise.all(ids.map((id) => run(markdownFilePath, id, args)))
}

/**
 * Start Runme server
 * @param {string | undefined} serverAddress address to start server on (@default `localhost:<free-port>`)
 * @returns {ChildProcess} instance of server child process
 */
export async function createServer (serverAddress?: string, args: GlobalArgs = {}) {
  const runmePath = await download(args.version)
  const address = serverAddress || `127.0.0.1:${await getPort()}`

  /**
   * need as it is not yet shipped by default
   */
  process.env.RUNME_SESSION_STRATEGY = 'recent'

  const server = cp.spawn(runmePath, ['server', '--address', address, '--runner'], {
    detached: true
  })
  await Promise.race([
    waitOn({ resources: [`tcp:${address}`] }),
    new Promise((_, reject) => server.on('exit', (exitCode) => exitCode && reject(new Error(`failed to start server`))))
  ])

  return server
}
