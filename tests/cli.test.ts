import cp from 'node:child_process'
import { describe, it, expect, vi, afterAll } from 'vitest'

import { runme } from '../src/cli.js'

vi.mock('node:child_process', () => ({
  default: {
    spawn: vi.fn().mockReturnValue({ on: vi.fn() }),
    exec: vi.fn()
  }
}))

vi.mock('node:os', () => ({
  default: {
    type: vi.fn().mockReturnValue('Darwin'),
    arch: () => 'arm64',
    platform: vi.fn().mockReturnValue('darwin')
  }
}))

describe('RunmeJS CLI', () => {
  it('supports defauls from config file', async () => {
    process.argv = ['nodepath', 'binPath', 'run', '--chdir=./examples', '--filename=example.md']
    await runme()
    expect(
      vi.mocked(cp.spawn).mock.calls[0][0]
        .endsWith('.bin/runme run --chdir=./examples --filename=example.md')
    ).toBe(true)
  })
})

afterAll(() => {
  vi.restoreAllMocks()
})
