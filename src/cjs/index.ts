exports.deserialize = async function (content: any) {
  const { deserialize } = await import('../index.js')
  return deserialize(content)
}

exports.serialize = async function (cells: any) {
  const { serialize } = await import('../index.js')
  return serialize(cells)
}
