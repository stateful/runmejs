import yargs from 'https://cdn.deno.land/yargs/versions/yargs-v16.2.1-deno/raw/deno.ts';
import * as _ from 'https://deno.land/x/lodash@4.17.15-es/lodash.js';

import * as runCommand from './cmds/run.ts'
import * as listCommand from './cmds/list.ts'
import * as printCommand from './cmds/print.ts'
import * as sessionCommand from './cmds/session.ts'

const RUNME_VERSION = 'v0.0.1'

yargs(Deno.args)
   .version(RUNME_VERSION)
   .scriptName('runme')
   .command(runCommand)
   .command(listCommand)
   .command(printCommand)
   .command(sessionCommand)
   .alias('h', 'help')
   .alias('v', 'version')
   .epilogue('Copyright ©️  2023 — Stateful Inc.')
   .help()
   .demandCommand(1)
   .strict()
   .argv
