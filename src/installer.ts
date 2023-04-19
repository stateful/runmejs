import os from 'node:os'
import url from 'node:url'
import util from 'node:util'
import path from 'node:path'
import zlib from 'node:zlib'
import fs from 'node:fs/promises'
import stream from 'node:stream'

import tar from 'tar-fs'
import fetch from 'node-fetch'

import { hasAccess } from './utils.js'
import { SUPPORTE_PLATFORMS } from './constants.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const streamPipeline = util.promisify(stream.pipeline)

/**
 * download runme binary from GitHub
 * @returns file path to downloaded binary
 */
export async function download (runmeVersion = process.env.RUNME_VERSION || 'latest') {
  const targetDir = path.resolve(__dirname, '..', '.bin')
  const isWindows = os.platform() === 'win32'
  const binaryFilePath = path.resolve(targetDir, `runme${isWindows ? '.exe' : ''}`)

  if (await hasAccess(binaryFilePath)) {
    return binaryFilePath
  }

  const platform = getPlatformMetadata()
  if (!platform) {
    throw new Error('Platform not supported')
  }

  const [version, type, target, ext] = [runmeVersion, platform.TYPE.toLocaleLowerCase(), platform.TARGET, platform.EXTENSION]
  const url = `https://download.stateful.com/runme/${version}/runme_${type}_${target}.${ext}`
  const res = await fetch(url)

  if (!res.body) {
    throw new Error(`Failed to download binary (statusCode ${res.status})`)
  }

  await fs.mkdir(targetDir, { recursive: true })
  await streamPipeline(res.body, zlib.createGunzip(), tar.extract(targetDir))
  return binaryFilePath
}

/**
 * Determine current running platform and determine if it is supported
 * @returns platform information if supported, undefined otherwise
 */
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
}
