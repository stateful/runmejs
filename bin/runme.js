#!/usr/bin/env node

(async () => {
  const { runme } = await import('../dist/cli.js')
  return runme()
})()
