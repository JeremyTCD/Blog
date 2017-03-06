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
const execFileSync = require('child_process').execFileSync;
const gaze = require('gaze');
const templateCopyFiles = require(path.join(templateProjectDir, 'build.copy.js'));
function docfxBuild(f, curr, previous) {
    templateCopyFiles();
    execFileSync('docfx', ['build', '-t ' + path.join(templateProjectDir, 'bin')], { stdio: [0, 1, 2] });
}

docfxBuild();

gaze(['templates/*', 'plugins/*', 'fonts/*', 'misc/*'],
    {
        cwd: templateProjectDir
    },
    function (err, watcher) {
        watcher.on('all', docfxBuild);
    }
);

gaze(['articles/*', '*.md'],
    {
        cwd: __dirname
    },
    function (err, watcher) {
        watcher.on('all', docfxBuild);
    }
);