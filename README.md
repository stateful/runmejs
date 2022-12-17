# Runme.js [![Test Changes](https://github.com/stateful/runmejs/actions/workflows/test.yaml/badge.svg)](https://github.com/stateful/runmejs/actions/workflows/test.yaml) [![npm version](https://badge.fury.io/js/runme.svg)](https://badge.fury.io/js/runme) [![deno module](https://shield.deno.dev/x/runme)](https://deno.land/x/runme)

> A JavaScript module to use Runme in Node.js, Deno or browser environments.

_Runme.js_ contains the the [Runme CLI](https://github.com/stateful/runme) as WASM and allows to access its functionality through a simple JavaScript interface.

## Install

You can run this module in Node.js and Deno environments.

### Node.js

Install the module through NPM:

```sh
$ npm install runme
# or Yarn
$ yarn add runme
```

You can also install the package globally and it as a CLI, e.g.:

```sh
npm i -g runme
runme list
```

### Deno

You can import the module directly from the Deno module hosting service via `https://deno.land/x/runme@0.4.3/mod.ts`.

## Usage

The module exposes the following methods:

### `deserialize`

Deserialize markdown into an AST:

```ts
import { deserialize } from 'runme'
// or when using Deno:
// import { deserialize } from 'https://deno.land/x/runme@0.4.3/mod.ts'

console.log(await deserialize(
    '## Hello World\n' +
    '```sh\n' +
    'echo "Hello World"\n'
    '```'
))
/**
 * outputs:
 * [{
 *     kind: 1,
 *     languageId: "",
 *     value: "# Hello World",
 * }, {
 *     kind: 2,
 *     languageId: "sh",
 *     metadata: {
 *       "runme.dev/name": "echo-hello",
 *     },
 *     value: 'echo "Hello World"',
 * }]
 */
```

### `serialize`

Serialize an AST into markdown:

```ts
import { serialize } from 'runme'
// or when using Deno:
// import { serialize } from 'https://deno.land/x/runme@0.4.3/mod.ts'

console.log(await serialize([
    {
        kind: 1,
        value: '# Hello World'
    }, {
        kind: 2
        languageId: 'sh',
        value: 'echo "Hello World"'
    }
])

/**
 * outputs:
 * -----------------------
 * ## Hello World
 *
 * ```sh
 * echo "Hello World"
 * ```
 *
 * -----------------------
 */
```

---

<p align="center"><small>Copyright 2022 © <a href="http://stateful.com/">Stateful</a> – Apache 2.0 License</small></p>
'# Hello World\n```sh\n```'),
