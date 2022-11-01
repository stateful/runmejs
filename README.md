# Runme.js

> A JavaScript module to use Runme in Node.js, Deno or browser environments.

_Runme.js_ contains the the [Runme CLI](https://github.com/stateful/runme) as WASM and allows to access its functionality through a simple JavaScript interface. The module exposes the following methods:

### `parse`

Parse markdown into AST:

```ts
import { parse } from 'runme'

console.log(await parse('./README.md'))
/**
 * outputs:
 * [
 *   ...
 *   {
 *     content: 'echo "hello world"\n',
 *     name: 'echo-hello',
 *     language: 'sh',
 *     lines: [ 'echo "hello world"' ]
 *   },
 *   ...
 * ]
 */
```

---

<p align="center"><small>Copyright 2022 © <a href="http://stateful.com/">Stateful</a> – Apache 2.0 License</small></p>
