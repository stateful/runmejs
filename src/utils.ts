import fs from 'node:fs/promises'

export async function hasAccess (filePath: string) {
  return fs.access(filePath).then(() => true, () => false)
}
