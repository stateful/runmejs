import os from 'node:os'
import fs from 'node:fs/promises'
import cp from 'node:child_process'
import url from 'node:url'
import path from 'node:path'
import zlib from 'node:zlib'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

import tar from 'tar-fs'
import fetch from 'node-fetch'

import { SUPPORTE_PLATFORMS, RUNME_VERSION } from './constants.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const streamPipeline = promisify(pipeline)

export async function runme () {
  const binaryPath = await download()
  const command = `${binaryPath} ${process.argv.slice(2).join(' ')}`
  return cp.spawn(command, { stdio: 'inherit', shell: true, env: process.env })
}

export async function download () {
  const targetDir = path.resolve(__dirname, 'bin')
  const binaryFilePath = path.resolve(targetDir, 'runme')
  const hasDownloaded = await fs.access(binaryFilePath).then(() => true, () => false)

  if (hasDownloaded) {
    return binaryFilePath
  }

  const platform = getPlatformMetadata()
  const [version, type, target, ext] = [RUNME_VERSION, platform.TYPE.toLocaleLowerCase(), platform.TARGET, platform.EXTENSION]
  const url = `https://download.stateful.com/runme/${version}/runme_${type}_${target}.${ext}`
  const res = await fetch(url)

  if (!res.body) {
    throw new Error(`Failed to download binary (statusCode ${res.status})`)
  }

  await fs.mkdir(targetDir, { recursive: true })
  await streamPipeline(res.body, zlib.createGunzip(), tar.extract(targetDir))
  return binaryFilePath
}

const getPlatformMetadata = () => {
  const type = os.type()
  const architecture = os.arch()

  for (let supportedPlatform of SUPPORTE_PLATFORMS) {
    if (
      type === supportedPlatform.TYPE &&
      architecture === supportedPlatform.ARCHITECTURE
    ) {
      return supportedPlatform
    }
  }

  console.log(
    `Platform with type "${type}" and architecture "${architecture}" is not supported ` +
    `by "runme".\nYour system must be one of the following:\n`
  )
  console.table(SUPPORTE_PLATFORMS)
  process.exit(1)
}
