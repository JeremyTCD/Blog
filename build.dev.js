const path = require('path');
const argv = require('yargs').argv;

const templateProjectDir = argv.t;

// Start webpack-dev-server
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const templateWebpackConfig = require(path.join(templateProjectDir, 'webpack.config.js'));
templateWebpackConfig.entry.bundle.unshift("webpack-dev-server/client?http://localhost:8080/");
templateWebpackConfig.resolve.modules.unshift(path.join(__dirname, "node_modules"));
const compiler = webpack(templateWebpackConfig);
const server = new webpackDevServer(compiler,
    {
        contentBase: path.join(__dirname, '_site'),
        watchContentBase: true,
        publicPath: '/styles/'
    });
server.listen(8080, "127.0.0.1", function () {
    console.log("Starting server on http://localhost:8080");
});

// Start docfx watcher
const watch = require('watch');
const execFileSync = require('child_process').execFileSync;
const templateCopyFiles = require(path.join(templateProjectDir, 'build.copy.js'));
var numRuns = 0;
function docfxBuild(f, curr, previous) {
    if (++numRuns > 3) {// Only run once on initialization
        templateCopyFiles();
        execFileSync('docfx', ['build', '-t ' + path.join(templateProjectDir, 'bin')], { stdio: [0, 1, 2] });
    }
}
watch.watchTree(path.join(templateProjectDir, 'templates'), docfxBuild);
watch.watchTree(path.join(templateProjectDir, 'plugins'), docfxBuild);
watch.watchTree(path.join(templateProjectDir, 'fonts'), docfxBuild);
watch.watchTree(path.join(templateProjectDir, 'misc'), docfxBuild);
watch.watchTree(path.join(__dirname, 'articles'), docfxBuild);
