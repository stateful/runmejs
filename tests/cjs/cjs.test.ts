const assert = require('node:assert')
// eslint-disable-next-line import/extensions
const { run, createServer } = require('../../')

;(async function test () {
  console.log('Running CJS tests...')
  assert.equal(typeof run, 'function')
  assert.equal(typeof createServer, 'function')
  console.log('CJS tests passed ✅')
})()

