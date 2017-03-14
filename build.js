const path = require('path');
const argv = require('yargs').argv;
const fs = require('fs-extra');
const rimraf = require('rimraf');

const templateProjectDir = argv.t;
const execFileSync = require('child_process').execFileSync;
const templateCopyFiles = require(path.join(templateProjectDir, 'build.copy.js'));
function docfxBuild(f, curr, previous) {
    rimraf.sync('./_site');
    // Symbolic link used to link index.html to default root object in production
    fs.copySync(path.join(__dirname, 'index.html'), path.join(__dirname, '_site/index.html'));
    templateCopyFiles();
    execFileSync('docfx', ['build', '-t ' + path.join(templateProjectDir, 'bin')], { stdio: [0, 1, 2] });
}

const webpack = require('webpack');
const templateWebpackConfig = require(path.join(templateProjectDir, 'webpack.config.js'));
webpack(templateWebpackConfig, function (err, stats) {
    docfxBuild();
});
