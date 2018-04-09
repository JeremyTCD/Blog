---
mimo_pageDescription: Incomplete
mimo_pageTitle: Typescript Module Resolution
mimo_pageID: typescript-module-resolution
mimo_date: Apr 7, 2018

mimo_includeInSal: false
mimo_includeInSearchIndex: false
---

# What is a module?
A file with a certain syntax that marks it as logic to execute in its own context
https://www.typescriptlang.org/docs/handbook/modules.html
https://docs.npmjs.com/getting-started/packages

# What are typings?
Static typing metadata. Could be located:
- In a folder located in node_modules/@types. These are for libraries that do not ship with typings, 
  and so rely on third party type definitions.
- In a package. A package can ship with typings, the "typings" field in package.json can be used to 
  point to such files.
- In a project. d.ts files can be created to augment libraries or to declare variables that aren't
  available at compile time.

# What do typings have to do with modules?
When tsc resolved modules, it doesn't care about .js files, instead, it looks for ts files or d.ts 
files for each module.

# How can tsc's module resolution be logged?
- tsc --traceResolution, or traceResolution in compilerOptions.

# What is baseUrl?
- Path that non-relative module strings are resolved relative to.

# What is typeRoots?
- Directories that typings are resolved from (for modules that don't ship with typings)