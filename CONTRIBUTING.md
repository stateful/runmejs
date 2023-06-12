---
cwd: ./
---

# Contributing

This project maintains the following workflows and Tasks.

## Workflows

### Build Project

To build the project, run:

```sh { name=build }
runme run clean compile
```

### Test Project

To run the entire test pipeline, call:

```sh { name=test }
runme run test:unit test:cjs
```

This will run unit tests via Vitest:

```sh { name=test:unit }
npx vitest --config ./vitest.config.ts
```

and verifies that the package can be imported in a CJS environment:

```sh { name=test:cjs cwd=./tests/cjs }
npx ts-node ./cjs.test.ts",
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
```

### Post Install Hook

If the user desires to have Runme installed during installation of the package, this hooks downloads Runme for them:

```sh { name=postinstall }
node ./postInstall.js
```
