---
cwd: ./
---

# Contributing

This project maintains the following workflows and Tasks. You can start contributing by cloning the code base, either manually or by clicking on:

[![Run with Runme](https://badgen.net/badge/Run%20with/Runme/5B3ADF?icon=https://runme.dev/img/logo.svg)](https://runme.dev/api/runme?repository=https%3A%2F%2Fgithub.com%2Fstateful%2Frunmejs.git&fileToOpen=CONTRIBUTING.md)

Then install it's dependencies via:

```sh { name=install }
npm ci
```

## Workflows

### Build Project

To build the project, run:

```sh { name=build }
RUNME_PROJECT="" ./node_modules/runme/.bin/runme run clean compile
```

### Test Project

To run the entire test pipeline, call:

```sh { name=test }
RUNME_PROJECT="" ./node_modules/runme/.bin/runme run test:lint test:unit test:cjs
```

This will run [Eslint](https://eslint.org/) checks:

```sh { name=test:lint }
npx eslint src tests
```

unit tests via [Vitest](https://vitest.dev/):

```sh { name=test:unit }
npx vitest --config ./vitest.config.ts
```

and verifies that the package can be imported in a CJS environment:

```sh { name=test:cjs cwd=./tests/cjs }
npx ts-node ./cjs.test.ts
```

### Watch Files

To have the source files automatically re-compiled after changing, run:

```sh { name=watch }
npx tsc -p ./tsconfig.json --watch
```

## Tasks

Workflows consist of the following individual tasks:

### Clean Project

Remove build files and other log artifacts:

```sh { name=clean }
npx rimraf dist coverage ./.bin
```

### Compile

To compile source files via TypeScript, run:

```sh { name=compile }
npx tsc -p ./tsconfig.json
cp ./src/cjs/package.json ./dist/cjs
```
