const gulp = require('gulp');
const webpack = require('webpack');
const argv = require('yargs').argv;
const path = require('path');
const execFileSync = require('child_process').execFileSync;
const browserSync = require('browser-sync');
const rimraf = require('rimraf');

const templateDir = argv.t;
const templateWebpackConfig = require(
    path.join(templateDir, 'webpack.config.js')
);
const webpackCompiler = webpack(templateWebpackConfig);

gulp.task('build:site', function () {
    buildSite();
});

gulp.task('start', function () {
    gulp.watch(['./articles/**/*.*',
        './*.md',
        './toc.yml',
        './docfx.json',
        './token.json'],
        ['build:site']);

    // TODO: Pre build, delete bin folder
    webpackCompiler.watch({},
        (err, stats) => {
            console.log(stats.toString());
            if (err) {
                console.log(err);
            } else {
                buildSite();
            }
        }
    )
});

function buildSite() {
    rimraf.sync('./_site/**/*.*');
    execFileSync('docfx',
        [
            'docfx.json',
            '-t ' + path.join(templateDir, 'bin')
        ],
        {
            stdio: [0, 1, 2]
        });

    if (!browserSync.active) {
        browserSync({ server: "./_site", open: false });
    }
    browserSync.reload();
}
