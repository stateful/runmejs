import path from 'node:path'
import cp, { ChildProcess } from 'node:child_process'

import getPort from 'get-port'
import waitOn from 'wait-on'
import { exec } from '@actions/exec'

import { hasAccess } from './utils.js'
import { download } from './installer.js'
import type { RunArgs, GlobalArgs } from './types'

/**
 * Run a selected command
 */
export async function run (markdownFilePath: string, idOrIds: string | string[], args: RunArgs = {}) {
  const runmePath = await download(args.version)
  const absoluteMarkdownPath = path.resolve(process.cwd(), markdownFilePath)
  const cellIdsToExecute = (Array.isArray(idOrIds) ? idOrIds : [idOrIds])
    .filter((id) => typeof id === 'string')

  if (!(await hasAccess(absoluteMarkdownPath))) {
    throw new Error(`Can't find or don't have access to ${absoluteMarkdownPath}`)
  }

  if (cellIdsToExecute.length === 0) {
    throw new Error('Command has no cell ids defined to execute')
  }

  for (const cellId of cellIdsToExecute) {
    const execArgs = [
      'run',
      cellId,
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

    await exec(runmePath, execArgs)
  }
}

/**
 * Start Runme server
 * @param serverAddress address to start server on (@default `localhost:<free-port>`)
 * @returns ChildProcess instance of server child process
 */
export async function createServer (serverAddress?: string, args: GlobalArgs = {}) {
  const runmePath = await download(args.version)
  const address = serverAddress || `localhost:${await getPort()}`
  const server = cp.spawn(runmePath, ['server', '--address', address], {
    detached: true
  })
  await waitOn({ resources: [`tcp:${address}`] })
  return server
}
