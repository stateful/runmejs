exports.run = async function (markdownFilePath: any, idOrIds: any, args: any) {
  const { run } = await import('../index.js')
  return run(markdownFilePath, idOrIds, args)
}

exports.createServer = async function (serverAddress: any, args: any) {
  const { createServer } = await import('../index.js')
  return createServer(serverAddress, args)
}
