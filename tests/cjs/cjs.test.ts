const assert = require('node:assert')
const { deserialize, serialize } = require('../../')

async function deserializeTest () {
    assert.equal(typeof deserialize, 'function')
    const result = await deserialize('# A Test')

    assert.equal(result.length, 1)
    assert.equal(result[0].kind, 1)
    assert.equal(result[0].value, '# A Test')
    assert.equal(result[0].languageId, '')
}

function serializeTest () {
    assert.equal(typeof serialize, 'function')
}

;(async function test () {
    console.log('Running CJS tests...')
    await deserializeTest()
    serializeTest()
    console.log('CJS tests passed ✅')
})()

