---
mimo_pageDescription: Incomplete
mimo_pageTitle: Typescript Web Workers
mimo_pageID: typescript-web-workers
mimo_date: Apr 12, 2018

mimo_includeInSal: false
mimo_includeInSearchIndex: false
---

# What is a web worker?
A js file. If it contains functions with specific names, these functions allow communication with the main thread. https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

# Compiling a ts web worker
A separate tsconfig without the dom lib but with the webworker lib is required. Web workers must be compiled as a separate project.

# Referencing a web worker as a module, resolving it with webpack
Install worker-loader, setup as directed - https://webpack.js.org/loaders/worker-loader/#integrating-with-typescript, basically:
   - Create a type declaration for modules with name worker-loader!*. Declaring an ambient module with name 'worker-loader!*' allows for imports in the form 
     worker-loader!* - https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#wildcard-character-in-module-names.
   - This type declaration must export a class (an instantiable type).
   - Import workers where required and instantiate instances of them. 
Is there anyway to import workers without using inline loader syntax?
