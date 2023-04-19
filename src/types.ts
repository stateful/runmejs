import type { ChildProcess } from "node:child_process"

export interface GlobalArgs {
  /**
   * Define which Runme version to use
   */
  version?: string
}

export interface RunArgs extends GlobalArgs {
  /**
   * Print the final command without executing.
   */
  dryRun?: boolean
  /**
   * Server address to connect runner to
   * @default process.env.RUNME_SERVER_ADDR
   */
  server?: string | ChildProcess
  /**
   * Directory for TLS authentication
   * @default "$HOME/.config/stateful/tls"
   */
  tls?: string
}
