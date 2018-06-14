---
mimo_pageDescription: A how-to on creating C# wrappers for javascript libraries.
mimo_pageTitle: Creating C# Wrappers for Javascript Libraries
mimo_pageID: creating-csharp-wrappers-for-javascript-libraries
mimo_date: Jun 13, 2018
mimo_socialMediaCard: true
mimo_shareOnFacebook: true
mimo_shareOnTwitter:
    hashtags: csharp, javascript
    via: JeremyTCD
---

# Creating a C# Wrapper for a Javascript Library
Many of the most popular front-end libraries, such as the syntax-highlighter [Prism](https://prismjs.com/), are javascript(JS) libraries. That's to be 
expected, since such libraries are mostly used client-side. There are however, situations where such libraries can't be used client side; for example, 
[AMP](https://www.ampproject.org/) pages can't run scripts, so tasks like syntax-highlighting must be done by server-side applications
that generate AMP pages. In such situations, you might have to use JS libraries in C# projects. This article explains how you can do that, 
it covers everything from running JS in C# to packing JS into Nuget packages.

- explain why bother wrapping?
    - if js used in end project, still need to do all this stuff
    - this way, just install nuget package and good to go

- will be using syntaxhighlighters.prism as an example
- can view the complete project here

## Terminology
The following are tools, files and concepts that I mention in this article. I wrote this section for the benefit of those who might be familiar with say
the .Net ecosystem but not the front-end ecosystem or vice versa. If you're already familiar with them, feel free to skip this section.
Term descriptions have been kept simple for the sake of brevity, consider exploring the links for further information:

| Term | Description |
| ---- | :---------- |
| Node.js | [Node.js](https://nodejs.org/en/) is a JS runtime. Essentially, it wraps [V8](https://developers.google.com/v8/), Chrome's JS engine, and it defines a JS [API](https://nodejs.org/dist/latest-v10.x/docs/api/). Its JS API allows for interations with operating systems and more, making it possible to build server-side applications using JS. |
| Yarn | [Yarn](https://yarnpkg.com/en/) is a command line tools for managing JS packages. |
| package.json | A [package.json](https://docs.npmjs.com/files/package.json) file that contains metadata for a JS package. It includes sections for specifying dependencies. When `yarn install` is run in a directory with a package.json file, dependencies are installed to a folder in the same directory named node_modules. |
| Webpack | [webpack](https://webpack.js.org/) is a tool for processing and bundling front-end assets like styles and scripts. In this article, it is only used for bundling JS (essentially combining multiple JS files into a single, easy-to-consume file). |
| webpack.config.js| A [webpack.config.js](https://webpack.js.org/configuration/) file configures webpack's behaviour. Since webpack is only used to bundle JS in this article, the webpack.config.js used is quite basic. |
| Nuget | [Nuget](https://www.nuget.org/) is a package management system for .Net packages. |
| MSBuild | [MSBuild](https://docs.microsoft.com/en-us/visualstudio/msbuild/msbuild) is a build engine. Essentially, it processes projects in a configurable pipeline to produce usable software. A step in the pipeline is referred to as a [target](https://docs.microsoft.com/en-us/visualstudio/msbuild/msbuild-targets) while options for targets are referred to as [properties](https://docs.microsoft.com/en-us/visualstudio/msbuild/msbuild-properties).  |
| .csproj | A .csproj file is an XML file that configures MSBuild's behaviour for the project, effectively defining a C# project. It specifies targets, properties and more. |
| .nuspec | A .nuspec file is an XML file that contains metadata for a C# Nuget package. In the past, it was necessary to manually define .nuspec files, these days, MSBuild generates .nuspec files when `msbuild pack` is called. MSBuild uses [these](https://docs.microsoft.com/en-us/nuget/reference/msbuild-targets#pack-target) properties to generate .nuspecs. |

## Using Javascript Packages in a C# project
- create a netstandard2.0 project

### Installing packages
- add package.json
  - code block showing package.json
- install MSBuild.Yarn
- add build.js
- add script build to package.json
- add target and yarn properties to csproj

### Using packages
- add interop.js
  - call lib from interop.js

## Running Javascript from C#


### Calling Javascript
First off, you'll need to add [Microsoft.AspNetCore.NodeServices](https://github.com/aspnet/JavaScriptServices/tree/dev/src/Microsoft.AspNetCore.NodeServices) to your C# project.
- refer to node services github page for instructions on how to use it
- create a service, e.g prismservice that calls interop.js
  - code block showing complete prismservice

+ info
- brief description of how node services works
  - creates node process 
  - creates a http server in the process
  - sends invoke args to server in json format
  - deserializes result
  
- info on alternatives
  - https://github.com/tjanczuk/edge
    - no netstandard support
    - but more performant since uses node dlls directly
    - nodeServices is an abstraction over node usage and intend to utilize edge if possible
  - https://github.com/prepare/Espresso
    - promising but project still in early stages
  - https://github.com/Microsoft/ClearScript/tree/master/ClearScript
    - no netstandard support
    - no node.js support
### exception handling
  - aggregate exception
### debugging
  - addNodeServices
    - configure launchdebug
    - --inspect-brk not supported, pull request created
    - break after dummy invokeAsync and wait for debugger to connect (find correct phrasing)
    - chrome://inspect 
### disposal      
  - auto disposes using finalizer          
  - if unexpected shutdown, auto disposes using polling on node side           
  - should still endeavour to call dispose    

## Packing js in a nuget package
- add webpack
- generate bundle
  - use project name
  - msbuild properties to get it copied to output and for proper nuspec generation
- end user usage example
  - simple console application

## Conclusion
