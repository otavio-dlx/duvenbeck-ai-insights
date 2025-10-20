### Install and Link TypeScript Globally

Source: https://github.com/microsoft/typescript/wiki/Using-the-Compiler-API-(TypeScript-1.4)

This snippet provides commands to install TypeScript globally using npm and then link it to your project. It also mentions `tsd` as an alternative for managing TypeScript definition files.

```Shell
npm install -g typescript
npm link typescript
```

--------------------------------

### Install latest TypeScript for compiler tracing

Source: https://github.com/microsoft/typescript/wiki/Performance-Tracing

This command installs the latest version of TypeScript, which is necessary to utilize the `--generateTrace` feature introduced in TypeScript 4.1. It's a crucial first step for generating detailed compiler performance traces.

```Shell
npm install typescript@latest
```

--------------------------------

### Install Sudo and Run Script in Minimal Docker Container

Source: https://github.com/microsoft/typescript/wiki/Docker-Quickstart

This snippet addresses the issue of running code that requires 'sudo' in a minimal Docker image. It provides commands to start a container, then update apt and install 'sudo' interactively inside the running container, followed by an example of executing a JavaScript file.

```Shell
docker run -it --rm -v %cd%:/fuzzer -w /fuzzer -u node node bash
```

```Shell
apt update; apt install sudo
node /work/index.js 1 3.3 3.4 false
```

--------------------------------

### Install and Link TypeScript for Development

Source: https://github.com/microsoft/typescript/wiki/Using-the-Compiler-API

Instructions to install TypeScript globally using npm and link it for project-specific use. This step is crucial for setting up the development environment before utilizing the TypeScript Compiler API. It also includes installing Node.js type declarations.

```sh
npm install -g typescript
npm link typescript
```

```sh
npm install -D @types/node
```

--------------------------------

### Analyze TypeScript compiler traces with @typescript/analyze-trace

Source: https://github.com/microsoft/typescript/wiki/Performance-Tracing

These commands install the `@typescript/analyze-trace` utility and then execute it to provide a quick summary of potential performance problems from the generated trace files. This tool helps in initial diagnosis of compiler bottlenecks by highlighting areas of concern.

```Shell
npm install @typescript/analyze-trace
```

```Shell
npx analyze-trace some_directory
```

--------------------------------

### Run Gollum Wiki Server Locally with Ruby

Source: https://github.com/microsoft/typescript/wiki/README

This snippet provides shell commands to set up and run the Gollum wiki server on a local machine. It requires Ruby to be installed and uses `gem install gollum` to install dependencies, followed by `gollum` to start the server, which is then accessible via `http://localhost:4567`.

```sh
gem install gollum

gollum
```

--------------------------------

### Install latest stable TypeScript via npm

Source: https://github.com/microsoft/typescript/blob/main/README.md

Installs the latest stable version of the TypeScript compiler as a development dependency using npm. This is the recommended way to get started with TypeScript for most projects.

```bash
npm install -D typescript
```

--------------------------------

### Example TypeScript Class for Documentation Generation Input

Source: https://github.com/microsoft/typescript/wiki/Using-the-Compiler-API

This TypeScript code provides an example class `C` with JSDoc comments for the class itself, its constructor, and constructor parameters. This serves as an input file (`test.ts`) for the documentation generator script, demonstrating the type of source code the generator processes.

```TypeScript
/**
 * Documentation for C
 */
class C {
    /**
     * constructor documentation
     * @param a my parameter documentation
     * @param b another parameter documentation
     */
    constructor(a: string, b: C) { }
}
```

--------------------------------

### Example TypeScript Compiler Type Entries from types.json

Source: https://github.com/microsoft/typescript/wiki/Performance-Tracing

This JSON snippet provides examples of type entries found in the TypeScript compiler's `types.json` output. These entries are crucial for understanding how types are represented internally, including their IDs, symbol names, recursion IDs, instantiated types, type arguments, and declaration locations. Analyzing these entries aids in debugging performance issues related to type checking by linking compiler-internal types back to source code declarations.

```json
{"id":20440,"symbolName":"NamedExoticComponent","recursionId":30,"instantiatedType":146,"typeArguments":[20437],"firstDeclaration":{"path":"PROJECT_ROOT/node_modules/@types/react/index.d.ts","start":{"line":359,"character":6},"end":{"line":363,"character":6}},"flags":["524288"]},
{"id":20441,"symbolName":"NamedExoticComponent","recursionId":30,"instantiatedType":146,"typeArguments":[20434],"firstDeclaration":{"path":"PROJECT_ROOT/node_modules/@types/react/index.d.ts","start":{"line":359,"character":6},"end":{"line":363,"character":6}},"flags":["524288"]}
```

--------------------------------

### Install alm.tools globally via npm

Source: https://github.com/microsoft/typescript/wiki/TypeScript-Editor-Support

This command installs the alm.tools TypeScript development environment globally using the Node Package Manager (npm). This allows `alm` to be run from any directory in the command line, providing a complete TypeScript development setup.

```shell
npm i alm -g
```
