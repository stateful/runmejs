# Runme.js

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

### Deno

You can import the module directly through e.g. esm.sh:

```ts
import { parse } from 'https://esm.sh/runme@0.1.0'
```

## Usage

The module exposes the following methods:

### `parse`

Parse markdown into AST:

```ts
import { parse } from 'runme'

console.log(await parse('## Hello World\n'))
/**
 * outputs:
 * [{ markdown: '## Hello World' }]
 */
```

---

<p align="center"><small>Copyright 2022 © <a href="http://stateful.com/">Stateful</a> – Apache 2.0 License</small></p>
