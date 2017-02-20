const webpack = require('webpack');
const argv = require('yargs').argv;
const path = require('path');
const templateProjectDir = argv.t;
const webpackDevServer = require('webpack-dev-server');
const templateWebpackConfig = require(path.join(templateProjectDir, 'webpack.config.js'));

// Add client/index.js to bundle
templateWebpackConfig.entry['styles/bundle'].unshift("webpack-dev-server/client?http://localhost:8080/")
templateWebpackConfig.resolve.modules.unshift(path.join(__dirname, "node_modules"));
const compiler = webpack(templateWebpackConfig);
const server = new webpackDevServer(compiler,
    {
        contentBase: path.join(__dirname, '_site'),
        watchContentBase: true,
        publicPath: '/'
    });

server.listen(8080, "127.0.0.1", function () {
    console.log("Starting server on http://localhost:8080");
});

// TODO: watch templates mustache template files and plugins, call 
// docfx if these change.