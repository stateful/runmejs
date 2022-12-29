import yargs from 'https://cdn.deno.land/yargs/versions/yargs-v16.2.1-deno/raw/deno.ts';
import * as _ from 'https://deno.land/x/lodash@4.17.15-es/lodash.js';

import * as runCommand from './cmds/run.ts'

const RUNME_VERSION = 'v0.0.1'

interface Arguments {
   help: boolean
   version: boolean
}

yargs(Deno.args)
   .version(RUNME_VERSION)
   .scriptName('runme')
   .command(runCommand)
   .alias('h', 'help')
   .alias('v', 'version').argv;
