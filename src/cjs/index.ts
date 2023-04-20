exports.run = async function (markdownFilePath: any, id: any, args: any) {
  const { run } = await import('../index.js')
  return run(markdownFilePath, id, args)
}

exports.runSeries = async function (markdownFilePath: any, idOrIds: any, args: any) {
  const { runSeries } = await import('../index.js')
  return runSeries(markdownFilePath, idOrIds, args)
}

exports.runParallel = async function (markdownFilePath: any, idOrIds: any, args: any) {
  const { runParallel } = await import('../index.js')
  return runParallel(markdownFilePath, idOrIds, args)
}

exports.createServer = async function (serverAddress: any, args: any) {
  const { createServer } = await import('../index.js')
  return createServer(serverAddress, args)
}
