import { test, expect } from 'vitest'

import { parse } from '../../src/index.js'

test('can import and use the package', async () => {
  expect(await parse('# Hello World\n```sh\necho "Hello World"\n```'))
    .toMatchSnapshot()
})
