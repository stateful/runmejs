import path from 'node:path'
import fs from 'node:fs/promises'
import { Transform, type TransformCallback } from 'node:stream'

import { SUPPORTED_RUNME_CONFIGFILE_NAMES } from './constants.js'

export async function hasAccess (filePath: string) {
  return fs.access(filePath).then(() => true, () => false)
}

export class RunmeStream extends Transform {
  #content = Buffer.from([])

  /**
   * filter stdout of execution
   */
  #canPropagateChunk (chunk: Buffer) {
    const chunkString = chunk.toString()
    return (
      // written by console.log in exec method of @actions/exec
      !chunkString.startsWith('[command]') &&
      // error of users using z4h, see https://github.com/stateful/runme/issues/221
      !chunkString.includes('/google-cloud-sdk/completion.zsh.inc') &&
      !chunkString.includes('.nvm/bash_completion:')
    )
  }

  /**
   * filter logs from @actions/exec
   */
  _transform (chunk: Buffer, encoding: string, callback: TransformCallback) {
    if (!this.#canPropagateChunk(chunk)) {
      return callback(null)
    }
    return callback(null, chunk.toString())
  }

  write (chunk: any, encoding?: BufferEncoding | TransformCallback, cb?: TransformCallback) {
    const enc: BufferEncoding = typeof encoding === 'string' ? encoding : 'utf8'
    if (!this.#canPropagateChunk(chunk)) {
      return false
    }

    const buffer = (Buffer.isBuffer(chunk)) ? chunk : Buffer.from(chunk, enc)
    this.#content = Buffer.concat([this.#content, buffer])
    super.write(chunk, encoding as BufferEncoding, cb)
    return true
  }

  toString (encoding?: BufferEncoding) {
    return this.#content.toString(encoding)
  }
}

async function importConfig (configPath: string) {
  if (configPath.endsWith('.js')) {
    return import(configPath)
  }
  if (configPath.endsWith('.json')) {
    const fileContent = await fs.readFile(configPath, 'utf-8')
    return JSON.parse(fileContent)
  }

  throw new Error(`Can't load Runme config "${configPath}", file type/format not supported`)
}

export async function findConfig(dir: string, depth = Infinity, configFileName = '.runmerc.js'): Promise<Record<string, any> | undefined> {
  if (depth < 0) {
      return
  }

  const config = (
    (await Promise.all(
      SUPPORTED_RUNME_CONFIGFILE_NAMES.map(
        (p) => fs.access(path.join(dir, p))
          .then(() => importConfig(p))
          .catch((e) => false)
        )
      )
    ).filter(Boolean)[0]
  ) as Record<string, any> | undefined

  if (config) {
    return config
  }

  const nextDir = path.dirname(dir)
  if (nextDir === dir) {
    return
  }

  return findConfig(nextDir, depth - 1)
}
