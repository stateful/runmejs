import path from 'node:path'
import fs from 'node:fs/promises'
import { Transform, type TransformCallback } from 'node:stream'

// @ts-expect-error create types for interfaces you use
import parser from '@gerhobbelt/gitignore-parser'

let cwd = process.cwd()
let gitIgnoreContent = ''
while (true) {
    if (cwd === path.sep) {
        break
    }

    const gitIgnorePath = path.join(cwd, '.gitignore')
    const gitIgnoreExists = await fs.access(gitIgnorePath).then(() => true, () => false)
    if (gitIgnoreExists) {
        gitIgnoreContent = (await fs.readFile(gitIgnorePath, 'utf8')).toString()
        break
    }

    cwd = path.dirname(cwd)
}

const gitignore = parser.compile(gitIgnoreContent)

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
