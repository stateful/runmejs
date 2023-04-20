import fs from 'node:fs/promises'

const isCompiled = await fs.access('./dist').then(() => true, () => false)
if (isCompiled && process.env.RUNME_DOWNLOAD_ON_INSTALL) {
  const { download } = await import('./dist/installer.js')
  const version = process.env.RUNME_VERSION || 'latest'
  console.log(`Download Runme ${version}`)
  await download(version)
}
