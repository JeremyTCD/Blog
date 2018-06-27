---
mimo_pageDescription: A tutorial on creating C# wrappers for javascript libraries.
mimo_pageTitle: Creating C# Wrappers for Javascript Libraries
mimo_pageID: creating-csharp-wrappers-for-javascript-libraries
mimo_date: Jun 13, 2018
mimo_socialMediaCard: true
mimo_shareOnFacebook: true
mimo_shareOnTwitter:
    hashtags: csharp, javascript
    via: JeremyTCD
---

    // TODO don't use task to describe literal tasks to avoid confusion

# Creating C# Wrappers for Javascript Libraries
This article is a step-by-step tutorial on creating C# wrappers for Javascript (JS) libraries. Over the course of this tutorial, we'll be creating a simplified C# wrapper for
the syntax-highlighting library, [Prism](https://prismjs.com/). The wrapper we create will be publishable as a Nuget package for easy consumption by .Net projects.  

The C# wrapper we create in this article is simplified for brevity's sake. Features like exception handling, disposal, infrastructure for dependency injection, guard clauses and more have been omitted. While these
features are important, they are outside the scope of this tutorial. The complete code for this tutorial can be found here: TODO. The code for a complete C# wrapper for Prism (with feautures that were omitted in the
demo) can be found here: [WebUtils.SyntaxHighlighters.Prism](https://github.com/JeremyTCD/WebUtils.SyntaxHighlighters.Prism).

Calling into JS libraries from C# is relatively straightforward. This article's focus is on setting up a system for managing JS packages, bundling JS modules and packing a JS bundle into a Nuget package.

## Why?

## Terminology
TODO this is not a Node.js or C# tutorial

The following are tools, files and concepts that are mentioned in this article. If you're familiar with the following terms, feel free to skip this section.
I've kept descriptions simple for the sake of brevity, consider exploring the links for further information:

| Term | Description |
| ---- | :---------- |
| Node.js | [Node.js](https://nodejs.org/en/) is a JS runtime. Essentially, it wraps [V8](https://developers.google.com/v8/), and it defines a JS [API](https://nodejs.org/dist/latest-v10.x/docs/api/). Its JS API allows for interactions with operating systems, making it possible to build server-side applications using JS. |
| Yarn | [Yarn](https://yarnpkg.com/en/) is a command line tool for managing JS packages. |
| package.json | A [package.json](https://docs.npmjs.com/files/package.json) file contains metadata for a JS package. When `yarn install` is run in a directory with a `package.json`, dependencies specified in the `package.json` are installed to a folder in the same directory named `node_modules`. |
| Webpack | [Webpack](https://webpack.js.org/) is a tool for processing and bundling front-end assets like styles and scripts. In this article, webpack is only used to bundle JS (combining multiple JS files into a single, easy-to-consume file). |
| webpack.config.js| A [webpack.config.js](https://webpack.js.org/configuration/) file configures webpack's behaviour. Since webpack is only used to bundle JS in this article, the `webpack.config.js` we will use is quite basic. |
| MSBuild | [MSBuild](https://docs.microsoft.com/en-us/visualstudio/msbuild/msbuild) is a build engine. Essentially, it processes projects in a configurable pipeline to produce usable software. MSBuild defines four core concepts:
TODO use list here: Steps in MSBuild's pipeline are called [targets](https://docs.microsoft.com/en-us/visualstudio/msbuild/msbuild-targets). For example, `CopyFilesToOutputDirectory` is a built in target that copies files to the output directory. Atomic operations used by targets are called [tasks](https://docs.microsoft.com/en-us/visualstudio/msbuild/msbuild-tasks). For example, `Copy` is a task that copies files. The `CopyFilesToOutputDirectory` target uses the `Copy` task. Options for tasks and targets are called [properties](https://docs.microsoft.com/en-us/visualstudio/msbuild/msbuild-properties). Inputs for the MSBuild pipeline, typically files, are referred to as [items](https://docs.microsoft.com/en-us/visualstudio/msbuild/msbuild-items). |
| .csproj | A `.csproj` is an XML file containing MSBuild targets, tasks, properties and items that configure MSBuild's behaviour for a C# project. |
| Nuget | [Nuget](https://www.nuget.org/) is a package management system for .Net packages. |
| .nuspec | A [.nuspec](https://docs.microsoft.com/en-us/nuget/reference/nuspec) is an XML file containing metadata for a Nuget package. MSBuild generates a `.nuspec` from a `.csproj` when `msbuild pack` is called on the `.csproj`. MSBuild refers to [these](https://docs.microsoft.com/en-us/nuget/reference/msbuild-targets#pack-target) properties in a `.csproj` to generate a `.nuspec`. |

TODO:Add to table: JS Module: There are a bunch of module definition system in the JS world.
    Within this article, "JS module" will be synonymous with "Node.js module". Following the Node.js module definition system, a module is essentially a JS file that imports other modules using
    the `require` keyword and exports objects using the `module.exports` property. For example, the following is a Node.js module that exports a single function:
    ```
    var prism = require('prismjs');
    var fs = require('fs');

    module.exports = function (path, languageAlias) {
        var fileContents = fs.readFileSync(path, 'utf8');
        return prism.highlight(fileContents, languageAlias);
    }
    ```

## Pre requisites
TODO exact versions of tools used


Using Visual Studio 2017+ (VS), or the [.NET Core CLI](https://docs.microsoft.com/en-us/dotnet/core/tools), create a .NET Standard 2.0+ class library project named `MyPrismWrapper` in a new solution. 
The solution's directory should look like this:

```
MyPrismWrapper
|-- MyPrismWrapper
|   |-- Class1.cs
|   |-- MyPrismWrapper.csproj
|   |-- ...
|-- MyPrismWrapper.sln  
```

## Adding Javascript Packages
We're going to specify which JS packages we need in a `package.json` and set things up so that whenever the `MyPrismWrapper` project is built, JS packages are automatically restored.

1. Add a folder named `Node` to the `MyPrismWrapper` project. This folder will contain everything JS related. 
2. Add a file named `package.json` with the following contents to the `Node` folder:
   ```
    {
        "private": true,
        "dependencies": {
            "prismjs": "^1.14.0"
        }
    }
   ```
    We've specified a single JS depedency, Prism. Since we're only using `package.json` to specify packages, we include the property `private` with value `true` to indicate that 
    this `package.json` should not be published.
3. Install the Nuget package [Yarn.MSBuild](https://github.com/natemcmaster/Yarn.MSBuild) to the `MyPrismWrapper` project. 

    The Yarn.MSBuild package contains Yarn and exposes an MSBuild task for running Yarn.
4. Add a target named `JavascriptBuild` to `MyPrismWrapper.csproj` and add a `Yarn` task to the target:
    ```
    <Project Sdk="Microsoft.NET.Sdk">

        <PropertyGroup>
            <TargetFramework>netstandard2.0</TargetFramework>
            <BundleName>$(AssemblyName).bundle.js</BundleName>
            <!-- Exclude Javascript\bin and Javascript\node_modules from project - https://github.com/dotnet/cli/issues/7525 -->
            <DefaultItemExcludes>Javascript\bin\**;Javascript\node_modules\**;$(DefaultItemExcludes)</DefaultItemExcludes>
        </PropertyGroup>

        <ItemGroup>
            <PackageReference Include="Yarn.MSBuild" Version="1.5.2" />
        </ItemGroup>

        <ItemGroup>
            <JavascriptInputs Include="Javascript\**" Exclude="$(DefaultItemExcludes)" />
            <JavascriptOutputs Include="Javascript\bin\$(BundleName)" />
        </ItemGroup>

        // TODO highlight these
        <Target Name="JavascriptBuild" BeforeTargets="BeforeBuild" Inputs="@(JavascriptInputs)" Outputs="@(JavascriptOutputs)">
            <Yarn WorkingDirectory=".\Javascript" Command="run build --env.mode=$(Configuration) --env.bundleName=$(BundleName)" />
        </Target>

    </Project>
    ```

    The `BeforeTargets` attribute specifies that `JavascriptBuild` must run before every build. The Yarn task specifies that `yarn install` must be called 
    in the `Node` folder whenever `JavascriptBuild` runs.  

    TODO: `Projects and Solutions > Web Package Management > NPM` can be disabled
5. Build the `MyPrismWrapper` project. 

    A `node_modules` folder and a `yarn.lock` will be generated in the `Node` folder. 
    - The `node_modules` folder will contain the `prismjs` package along with packages that Prism depends on. This folder should be excluded from source control.
    - The `yarn.lock` file facilitates deterministic package installation - given a `package.json` and a `yarn.lock`, the 
      `node_modules` folder generated by Yarn will always be identical. This file should be checked into source control.

    The MSBuild output from the build will look like this:

    INFO: If you're using VS, the following output should be displayed in the output window. If it isn't, ensure that
    `Tools > Options > Project and Solutions > Build and Run > MSBuild project build output verbosity` is set to `Normal` or higher.
    Similarly, if you're using the .NET Core CLI, the following output is only displayed if verbosity is set to `normal` or higher. You can set verbosity 
    by specifying the `--verbosity|-v` argument, for example, `dotnet build -v normal`.

    After setting verbosity, you will have to delete `node_modules` and build the project again to see the following output.

    ```
    1>Target CoreClean:
    ...
    1>Target JavascriptBuild:
    1>  yarn install v1.5.1
    1>  [1/4] Resolving packages...
    1>  [2/4] Fetching packages...
    1>  [3/4] Linking dependencies...
    1>  [4/4] Building fresh packages...
    1>  Done in 0.30s.
    1>Done building target "JavascriptBuild" in project "MyPrismWrapper.csproj".
    1>Target GenerateTargetFrameworkMonikerAttribute:
    ...
    ```

    On subsequent builds, Yarn will attempt to restore your JS packages - if they are not in sync with `package.json` they will be installed/deleted, if they are in sync, Yarn won't do anything. 
    This behaviour is similar to the that of the Nuget restore target that runs before every build to keep .Net packages up-to-date. The MSBuild output when JS packages are in sync will look like this:
    
    ```
    1>Target CoreClean:
    ...
    1>Target JavascriptBuild:
    1>  yarn install v1.5.1
    1>  [1/4] Resolving packages...
    1>  success Already up-to-date.
    1>  Done in 0.07s.
    1>Done building target "JavascriptBuild" in project "MyPrismWrapper.csproj".
    1>Target GenerateTargetFrameworkMonikerAttribute:
    ...
    ```
   
We're done adding JS packages! Your solution folder should now look like this:

```
MyPrismWrapper
|-- MyPrismWrapper
|   |-- Node
|       |-- node_modules
|           |-- prismjs
|           |-- ...
|       |-- package.json
|       |-- yarn.lock
|   |-- Class1.cs
|   |-- MyPrismWrapper.csproj
|   |-- ...
|-- MyPrismWrapper.sln  
```

## Preparing Javascript Libraries for Consumption
Now that our JS packages are automatically restored, we can move on to utilizing the libraries they contain. We're going to create our C# types and a JS interop layer that binds these types to JS libraries. 
Then, we'll be bundling our JS and setting things up so that the generated bundle gets copied to the output directory. Finally,
we'll write a couple of integration tests to verify that our setup works. 

NOTE:INFO: The following code highlights solutions to challenges faced when creating a C# wrapper for a JS library. Some features have been omitted in an effort to keep this article concise.
The source code for a complete C# wrapper for Prism can be found at this repository: 
[WebUtils.SyntaxHighlighters.Prism](https://github.com/JeremyTCD/WebUtils.SyntaxHighlighters.Prism); it includes features like guard clauses for arguments, exception handling, disposal, and 
infrastructure for dependency injection.

1. Add a file named `interop.js` with the following contents to the `Node` folder:
   ```
    var Prism = require('prismjs');
    var PrismLanguageLoader = require('prismjs/components/index.js');
    // Require all languages
    PrismLanguageLoader();

    module.exports = function (callback, code, languageAlias) {
        var result = Prism.highlight(code, Prism.languages[languageAlias], languageAlias);

        callback(null /* errors */, result);
    };
    ```

    This is a JS module that exports a single function. The function takes the arguments of `PrismService.Highlight` as arguments and generates a result that it passes to a callback. Everything in the module apart from the 
    exported function is Prism specific - Prism allows users to only `require` specific languages, we'll be requiring all of them since we are generating a wrapper.

2. Add webpack, webpack-cli and yargs to `package.json`:
   ```
    {
        "private": true,
        "dependencies": {
            "prismjs": "^1.14.0",
            "webpack": "^4.11.1",
            "webpack-cli": "^3.0.2",
            "yargs": "^11.0.0"
        }
    }
   ```
    We'll be using these tools to build a JS bundle. After updating `package.json`, rebuild your C# project so that `node_modules` is updated.
    After `node_modules` has been updated, it will contain lots of packages and be pretty large (20 MB+).

3. Add a file named `webpack.config.js` to the `Node` folder:
    ```
    const Path = require('path');

    module.exports = env => {
        let mode = env.mode.toLowerCase() === 'release' ? 'production' : 'development'; // Default to development, production mode minifies scripts
        console.log(`Webpack mode: ${mode}.`);

        return {
            mode: mode,
            target: 'node',
            entry: './interop.js',
            output: {
                path: Path.join(__dirname, 'bin'),
                filename: 'MyPrismWrapper.bundle.js'
            }
        };
    };
    ```
    
    This file generates the configuration object for building our bundle, `MyPrismWrapper.bundle.js`. It is a JS module that exports a function that takes a single object, `env`, as an argument and returns a webpack 
    configuration object. The property `env.mode` is used to disambiguate between production and development builds. The key difference between the production and development bundles is that the 
    production bundle will be minified.
    
4. Add a file named build.js to the `Node` folder:
    // TODO supply bundle name as command line arg, pass bundle name to webpack
    ```
    const fs = require('fs');
    const path = require('path');
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config.js');
    const argv = require('yargs').argv;

    let rebuild = true;
    let files = ['interop.js', 'package.json', 'webpack.config.js']; // Build when these files change. Note: could use fs.readdir to recursively find files instead

    let currentLastModifiedTime = 0;

    for (let file of files) {
        let stats = fs.statSync(file);
        let fileLastModifiedTime = new Date(stats.mtime.toISOString()).getTime();

        // We want the most recent file modification time
        if (fileLastModifiedTime > currentLastModifiedTime) {
            currentLastModifiedTime = fileLastModifiedTime;
        }
    }

    if (!fs.existsSync('./bin/MyPrismWrapper.bundle.js')) {
        console.log('Bundle does not exist, building bundle.js.');
    } else if (fs.existsSync('./lastBuildData')) {
        // Get last modified time
        let lastBuildData = JSON.parse(fs.readFileSync('./lastBuildData', 'utf8'));
        let lastMode = lastBuildData.mode;
        let lastModifiedTime = lastBuildData.modifiedTime;

        if (lastMode != argv.mode) {
            console.log(`Build mode has changed, rebuilding bundle.js. Last build mode: ${lastMode}, current build mode: ${argv.mode}.`);
        } else if (!Number.isInteger(lastModifiedTime)) {
            console.log(`Last modified time "${lastModifiedTime}" is invalid, rebuilding bundle.js.`);
        } else if (lastModifiedTime == currentLastModifiedTime) {
            // If last modified date is the same as currentLastModifiedTime, no changes have been made, so no need to rebuild.
            console.log('bundle.js is up to date.');
            rebuild = false;
        } else {
            console.log('File(s) changed, rebuilding bundle.js.');
        }
    } else {
        console.log('lastBuildData unavailable, rebuilding bundle.js.');
    }

    if (rebuild) {
        console.log('Rebuilding...');

        webpack(webpackConfig({ mode: argv.mode }), (err, stats) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Rebuild complete.');
                fs.writeFileSync('./lastBuildData', JSON.stringify({ modifiedTime: currentLastModifiedTime, mode: argv.mode }), { encoding: 'utf8' });
            }
        });
    }
    ```

    Bundling using webpack can take several seconds. We want to create a new bundle only when it is necessary to do so, not on every build. This script ensures that webpack only runs when:
    - The bundle has not been built before.
    - Build mode changes from `Release` to `Debug` or vice versa.
    - `interop.js`, `package.json` or `webpack.config.js` has changed since the last build.
    To keep track of the mode and modification time of the last build, this script generates a file, `lastBuildData`, that should not be checked in to source control.

6. Add an [Exec task](https://docs.microsoft.com/en-us/visualstudio/msbuild/exec-task) to `JavascriptBuild` target in `MyPrismWrapper.csproj`:
    ```
    <Project Sdk="Microsoft.NET.Sdk">

    <PropertyGroup>
        <TargetFramework>netstandard2.0</TargetFramework>
    </PropertyGroup>

    <ItemGroup>
        <PackageReference Include="Microsoft.AspNetCore.NodeServices" Version="2.1.0" />
        <PackageReference Include="Yarn.MSBuild" Version="1.5.2" />
    </ItemGroup>

    <Target Name="JavascriptBuild" BeforeTargets="BeforeBuild">
        <Yarn WorkingDirectory="./Node" Command="install" />
        <Exec WorkingDirectory="./Node" Command="node build.js --mode=$(Configuration)"></Exec>
    </Target>

    </Project>
    ```
    
    The Exec task executes `build.js` every time the C# project is built. `$(Configuration)` is the build configuration for the C# project (typically `Release` or `Debug`). Rebuild your project,
    the solution directory should look like this:

    ```
    MyPrismWrapper
    |-- MyPrismWrapper
    |   |-- Node
    |       |-- bin
    |           |-- MyPrismWrapper.bundle.js
    |       |-- node_modules
    |           |-- ...
    |       |-- build.js
    |       |-- interop.js
    |       |-- lastBuildData
    |       |-- package.json
    |       |-- webpack.config.js
    |       |-- yarn.lock
    |   |-- PrismService.cs
    |   |-- MyPrismWrapper.csproj
    |   |-- ...
    |-- MyPrismWrapper.sln  
    ```

    TODO:INFO: To debug `build.js` add [--inspect-brk](https://nodejs.org/en/docs/guides/debugging-getting-started/#command-line-options) option to the `node` invocation:
    ```
    <Exec WorkingDirectory="./Node" Command="node --inspect-brk build.js --mode=$(Configuration)"></Exec>
    ```
    This breaks execution of `build.js` at the first line. Navigate to `chrome://inspect` in Chrome and click `Open dedicated DevTools for Node`. You will then be able to step through 
    `build.js` using chrome developer tools.

7. Add Content item to `.csproj` to include `MyPrismWrapper.bundle.js` in `MyPrismWrapper` output directory:
    ```
    <Project Sdk="Microsoft.NET.Sdk">

        <PropertyGroup>
            <TargetFramework>netstandard2.0</TargetFramework>
        </PropertyGroup>

        <ItemGroup>
            <PackageReference Include="Microsoft.AspNetCore.NodeServices" Version="2.1.0" />
            <PackageReference Include="Yarn.MSBuild" Version="1.5.2" />
        </ItemGroup>

        <ItemGroup>
            <Content Include="Node\bin\MyPrismWrapper.bundle.js">
                <!-- Discards Node\bin file structure - https://github.com/Microsoft/msbuild/issues/2795 -->
                <Link>%(Filename)%(Extension)</Link>
                <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
            </Content`>`
        </ItemGroup>

        <Target Name="JavascriptBuild" BeforeTargets="BeforeBuild">
            <Yarn WorkingDirectory="./Node" Command="install" />
            <Exec WorkingDirectory="./Node" Command="node build.js --mode=$(Configuration)"></Exec>
        </Target>

    </Project>
    ```
    
    Rebuild `MyPrismWrapper` in `Debug` configuration, then navigate to `MyPrismWrapper\bin\Debug\netstandard2.0`. `MyPrismWrapper.bundle.js` will be in the directory, alongside `MyPrismWrapper.dll` and
    some other files. Since our library will be used by other projects, our bundle's name must be unique within the output directory. I recommend naming the bundle after the assembly that uses it since the assembly's name
    is guaranteed to be unique. For example, your assemblies name is `JeremyTCD.WebUtils.SyntaxHighlighters.Prism.dll`, your bundle's name should be `JeremyTCD.WebUtils.SyntaxHighlighters.Prism.bundle.js`.

## Consuming a Javascript Bundle

1. Install the Nuget package [Microsoft.AspNetCore.NodeServices](https://github.com/aspnet/JavaScriptServices/tree/dev/src/Microsoft.AspNetCore.NodeServices) to the `MyPrismWrapper` project. 

   Microsoft.AspNetCore.NodeServices facilitates execution of JS using Node.js. I recommend reading through its 
   [documentation](https://github.com/aspnet/JavaScriptServices/tree/dev/src/Microsoft.AspNetCore.NodeServices) before proceeding to the next step.

2. Replace `Class.cs` with `PrismService.cs`:
   ```
    using Microsoft.AspNetCore.NodeServices;
    using System;
    using System.Threading.Tasks;

    namespace MyPrismWrapper
    {
        public class PrismService
        {
            private readonly INodeServices _nodeServices;

            public PrismService(INodeServices nodeServices)
            {
                _nodeServices = nodeServices;
            }

            public virtual async Task<string> HighlightAsync(string code, string languageAlias)
            {
                return await _nodeServices.InvokeAsync<string>("MyPrismWrapper.bundle.js", code, languageAlias).ConfigureAwait(false);
            }
        }
    }
   ```    

    `PrismService` forwards highlighting jobs to Node.js through `InvokeAsync<T>(string moduleName, params object[] args)`.

    `moduleName` must be the path of a JS module, relative to the current working directory (obtained using 
    [Directory.GetCurrentDirectory](https://docs.microsoft.com/en-sg/dotnet/api/system.io.directory.getcurrentdirectory?view=netcore-2.1#System_IO_Directory_GetCurrentDirectory)) 
    of the calling application. 

    The JS module must export a single function that takes a callback and the contents of `args` as arguments. The function must call the callback with
    a result argument equivalent to an instance of type `T`. The module `interop.js` satisfies these conditions. Since `MyPrismWrapper.bundle.js` uses `interop.js` as its entry, 
    the bundle is essentially a JS module that exports the function exported by `interop.js`. You can confirm this by reading through `MyPrismWrapper.bundle.js`.

    TODO INFO:
    Under the hood, this is how the default implementation of `InvokeAsync<T>(string moduleName, params object[] args)` works:
    - Upon invocation, if no Node.js process exists, a Node.js process is started and a Http server is created in the Node.js process. All inter-process communication is done over Http.
    - The `args` `object[]` is serialized as a JSON string and sent, together with `moduleName`, to the Node.js process
    - The Http server running in the Node.js process deserializes the JSON string to a JS array, then runs the function exported by the module, passing a callback and the contents of the JS array as arguments.
    - The function exported by the module calls the callback with either a return value or an error.
    - Finally, the Http server serializes the result or error to a JSON string, and sends it back to the C# application, which deserializes the JSON string.

    `InvokeAsync<T>` isn't the most performant way to call JS from C#. Here are some alternatives and their pros and cons:    
    - [Edge.js](https://github.com/tjanczuk/edge) runs Node.js and the [Common Language Runtime](https://docs.microsoft.com/en-us/dotnet/standard/clr) (CLR) in the same process. Essentially, it defines bindings
      for the Node.js dll, as well as logic for marshalling CLR objects to V8 objects. This enables Edge.js to ship a single managed dll (that wraps Node.js) in its Nuget package. Edge.js is both more performant
      and more convenient than `Microsoft.AspNetCore.NodeServices`.

      Unfortunately, Edge.js is not [.Net Core runtime](https://github.com/dotnet/coreclr) (CoreCLR) compatible and can only be used from .Net Framework projects. Moreover, 
      it is not under active development and is [looking for a new home](https://twitter.com/tjanczuk/status/1007721290675830784) at the time of this writing. If these aren't issues for you,
      you could consider Edge.js as a replacement for `Microsoft.AspNetCore.NodeServices`.

   - [ClearScript](https://github.com/Microsoft/ClearScript/tree/master/ClearScript) is another Microsoft project. Like Edge.js it executes javascript in process. Unfortunately at the time of this writing, it
     is [isn't CoreCLR compatible](https://github.com/Microsoft/ClearScript/issues/9#issuecomment-356334147) either. Moreover, its bindings are for V8. This means JS libraries that depend on Node.js's built
     in API cannot be run using ClearScript. If you do not need CoreCLR compatiblity and your scripts do not use Node.js's built in API, ClearScript is a viable alternative.

   - [Espresso](https://github.com/prepare/Espresso), a fork of [VroomJS](https://github.com/fogzot/vroomjs), is shaping up to be an alternative to Edge.js. Espresso supports calls to Node.js from CoreCLR, but 
     is still in early stages of development at the time of this writing.

3. We're going to add some integration tests to verify that our setup works. There are several excellent test frameworks that you can choose from, in the following code, I'll be using [xUnit](https://xunit.github.io/),
    but you can use whatever you're comfortable with. Create a .NET Core console application project named `MyPrismWrapper.Tests` in your solution. The solution's directory should look 
    like this:

    ```
    MyPrismWrapper
    |-- MyPrismWrapper
    |   |-- ...
    |-- MyPrismWrapper.Tests
    |   |-- MyPrismWrapper.Tests.csproj
    |   |-- Program.cs
    |   |-- ...
    |-- MyPrismWrapper.sln  
    ```

    Update MyPrismWrapper.Tests.csproj with the following contents: 

    ```
    <Project Sdk="Microsoft.NET.Sdk">

    <PropertyGroup>
        <TargetFramework>netcoreapp2.0</TargetFramework>
    </PropertyGroup>

    <ItemGroup>
        <PackageReference Include="Microsoft.NET.Test.Sdk" Version="15.7.2" />
        <PackageReference Include="xunit" Version="2.3.1" />
        <PackageReference Include="xunit.runner.visualstudio" Version="2.3.1" />
    </ItemGroup>

    <ItemGroup>
      <ProjectReference Include="..\MyPrismWrapper\MyPrismWrapper.csproj" />
    </ItemGroup>

    </Project>
    ```

    Replace `Program.cs` with `PrismServiceIntegrationTests.cs`:
    ```
    using Microsoft.AspNetCore.NodeServices;
    using Microsoft.Extensions.DependencyInjection;
    using MyPrismWrapper;
    using Xunit;

    namespace JeremyTCD.WebUtils.SyntaxHighlighters.Prism.Tests
    {
        public class PrismServiceIntegrationTests
        {
            [Fact]
            public void HighlightAsync_HighlightsCode()
            {
                // Arrange 
                PrismService prismService = CreatePrismService();
                string dummyCode = @"public string ExampleFunction(string arg)
    {
        // Example comment
        return arg + ""dummyString"";
    }";
                string dummyLanguageAlias = "csharp";

                // Act
                string result = prismService.HighlightAsync(dummyCode, dummyLanguageAlias).Result;

                // Assert
                string expectedResult = @"<span class=""token keyword"">public</span> <span class=""token keyword"">string</span> <span class=""token function"">ExampleFunction</span><span class=""token punctuation"">(</span><span class=""token keyword"">string</span> arg<span class=""token punctuation"">)</span>
    <span class=""token punctuation"">{</span>
        <span class=""token comment"">// Example comment</span>
        <span class=""token keyword"">return</span> arg <span class=""token operator"">+</span> <span class=""token string"">""dummyString""</span><span class=""token punctuation"">;</span>
    <span class=""token punctuation"">}</span>";
                Assert.Equal(expectedResult, result);
            }

            private PrismService CreatePrismService()
            {
                var services = new ServiceCollection();
                services.AddNodeServices();
                ServiceProvider serviceProvider = services.BuildServiceProvider();
                INodeServices nodeServices = serviceProvider.GetRequiredService<INodeServices>();

                return new PrismService(nodeServices);
            }
        }
    }
    ```

    Using VS's [test explorer](https://docs.microsoft.com/en-sg/visualstudio/test/run-unit-tests-with-test-explorer) or `dotnet test`, run the test `HighlightAsync_HighlightsCode`. It should pass.

    TODO:INFO: Debugging javascript
    - use debugger; and never pause here: https://medium.com/@theroccob/never-pause-here-undoing-breakpoints-in-chrome-devtools-97e64cd06086
    ```
    private PrismService CreatePrismService()
    {
        var services = new ServiceCollection();
        INodeServices nodeServices;

        if (Debugger.IsAttached)
        {
            // Override INodeServices service registered by AddPrism to enable debugging
            services.AddNodeServices(options =>
            {
                options.LaunchWithDebugging = true;
                options.InvocationTimeoutMilliseconds = 99999999; // -1 doesn't work, once a js breakpoint is hit, the debugger disconnects
            });

            ServiceProvider serviceProvider = services.BuildServiceProvider();

            // InvokeAsync implicitly starts up a node instance. Adding a break point after InvokeAsync allows
            // chrome to connect to the debugger
            nodeServices = serviceProvider.GetRequiredService<INodeServices>();
            try
            {
                int dummy = nodeServices.InvokeAsync<int>("").Result;
            }
            catch
            {
                // Do nothing
            }
        }
        else
        {
            services.AddNodeServices();
            ServiceProvider serviceProvider = services.BuildServiceProvider();
            nodeServices = serviceProvider.GetRequiredService<INodeServices>();
        }

        return new PrismService(nodeServices);
    }
    ```
    - configure launchdebug
    - --inspect-brk not supported, pull request created
    - break after dummy invokeAsync and wait for debugger to connect (find correct phrasing)
    - chrome://inspect 

## Packing Javascript
We're going to tweak `MyPrismWrapper.csproj` to setup `.nuspec` generation, then, we're going to verify that the package generated from the `MyPrismWrapper` is valid.

1. Add the following lines to `MyPrismWrapper.csproj`:

    ```
    <Project Sdk="Microsoft.NET.Sdk">

    <PropertyGroup>
        <TargetFramework>netstandard2.0</TargetFramework>
    </PropertyGroup>

    <ItemGroup>
        <PackageReference Include="Microsoft.AspNetCore.NodeServices" Version="2.1.0" />
        <PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="2.1.0" />
        <PackageReference Include="Yarn.MSBuild" Version="1.5.2" />
    </ItemGroup>

    <ItemGroup>
        <Content Include="Node\bin\MyPrismWrapper.bundle.js">
            <!-- Discards Node\bin file structure - https://github.com/Microsoft/msbuild/issues/2795 -->
            <Link>%(Filename)%(Extension)</Link>
            <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
            <!-- This adds copyToOutput="true" to the corresponding files element in the nuspec generated for this project. copyToOutput="true" instructs consuming applications to copy this file
                 to the output directory on build - https://docs.microsoft.com/en-us/nuget/reference/msbuild-targets#including-content-in-a-package -->
            <PackageCopyToOutput>true</PackageCopyToOutput>
            <!-- Discards Node\bin file structure when copying to consuming project's application's folder - https://docs.microsoft.com/en-us/nuget/reference/nuspec#using-the-contentfiles-element-for-content-files -->
            <PackagePath>contentFiles\any\any</PackagePath>
        </Content>
    </ItemGroup>

    <Target Name="JavascriptBuild" BeforeTargets="BeforeBuild">
        <Yarn WorkingDirectory="./Node" Command="install" />
        <Exec WorkingDirectory="./Node" Command="node build.js --mode=$(Configuration)"></Exec>
    </Target>

    </Project>
    ```

    The `PackageCopyToOutput` and `PackagePath` elements ensure that `MyPrismWrapper.bundle.js` is copied to the consuming application's output folder.

    TODO:INFO: on embedding js

2. Using the Release configuration, create a nuget package for the `MyPrismWrapper` project using VS (right click project > publish) or `dotnet pack -c release`.

    Locate your package (if using VS, depending on the `Target Location` in the publish configuration options, it might be in `MyPrismWrapper\bin\Release\netstandard2.0\publish\` or `MyPrismWrapper\bin\Debug\netstandard2.0\publish\`). Extract the files 
    in the package and locate `MyPrismWrapper.nuspec`. It will look like this:

    ```
    <?xml version="1.0" encoding="utf-8"?>
    <package xmlns="http://schemas.microsoft.com/packaging/2013/05/nuspec.xsd">
      <metadata>
        <id>MyPrismWrapper</id>
        <version>1.0.0</version>
        <authors>MyPrismWrapper</authors>
        <owners>MyPrismWrapper</owners>
        <requireLicenseAcceptance>false</requireLicenseAcceptance>
        <description>Package Description</description>
        <dependencies>
          <group targetFramework=".NETStandard2.0">
            <dependency id="Microsoft.AspNetCore.NodeServices" version="2.1.0" exclude="Build,Analyzers" />
            <dependency id="Microsoft.Extensions.DependencyInjection" version="2.1.0" exclude="Build,Analyzers" />
            <dependency id="Yarn.MSBuild" version="1.5.2" exclude="Build,Analyzers" />
          </group>
        </dependencies>
        <contentFiles>
          <files include="any/any/MyPrismWrapper.bundle.js" buildAction="Content" copyToOutput="true" />
        </contentFiles>
      </metadata>
    </package>
    ```
    
    Note the `files` element. Note the `include` attribute, `any/any/MyPrismWrapper.bundle.js`. It just means that `MyPrismWrapper.bundle.js` is located in `contentFiles\any\any` in your package. By default, the [structure](https://docs.microsoft.com/en-us/nuget/reference/nuspec#package-folder-structure)
    of `contentFiles` should be `contentFiles/{codeLanguage}/{targetFrameworkMoniker}`, `any\any` just means that `MyPrismWrapper.bundle.js` can be used for any `codeLanguage`/`targetFrameworkMoniker` combination. The `copyToOutput` attribute instructs MSBuild to copy
    `MyPrismWrapper.bundle.js` to the output folder of any consuming project/application.

    TODO the simple C# wrapper for Prism built in this article is available from my myget feed...

## Conclusion
TODO