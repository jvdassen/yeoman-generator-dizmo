let pkg = require('../../package.js'),
    path = require('path');
let gulp = require('gulp'),
    gulp_copy = require('gulp-copy'),
    gulp_sass = require('gulp-sass'),
    gulp_sourcemaps = require('gulp-sourcemaps');
let extend = require('xtend'),
    pump = require('pump');

gulp.task('process-styles:copy', function (cb) {
    pump([
        gulp.src([
            'src/style/**/*', '!src/style/**/*.scss'
        ]),
        gulp_copy(path.join('build', pkg.name, 'style'), {
            prefix: 2
        })
    ], cb);
});
gulp.task('process-styles', ['process-styles:copy'], function (cb) {
    let cli_min = require('yargs')
        .default('minify')
        .argv.minify;

    let sourcemaps = false, sass = {
        outputStyle: cli_min === true ? 'compressed' : 'expanded'
    };

    if (pkg.dizmo && pkg.dizmo.build) {
        let cfg_min = pkg.dizmo.build.minify;
        if (cfg_min) {
            let cfg_ss = cfg_min.styles !== undefined ? cfg_min.styles : {};
            if (cfg_ss) {
                if (cfg_ss.sourcemaps) // by default w/o a source-map!
                {
                    sourcemaps = extend({loadMaps: true}, cfg_ss.sourcemaps);
                }
                if (cli_min === undefined && (
                    cfg_ss.sass || cfg_ss.sass === undefined))
                {
                    sass = extend({outputStyle: 'compressed'}, cfg_ss.sass);
                }
            }
        }
    }

    let argv = require('yargs')
        .default('sourcemaps', sourcemaps)
        .default('sass', sass).argv;

    if (typeof argv.sourcemaps === 'string') {
        argv.sourcemaps = JSON.parse(argv.sourcemaps);
    }
    if (typeof argv.sass === 'string') {
        argv.sass = JSON.parse(argv.sass);
    }
    if (typeof argv.sass === 'boolean') {
        argv.sass = {
            outputStyle: argv.sass === true ? 'compressed' : 'expanded'
        };
    }

    let stream = [gulp.src([
        'src/style/**/*.scss'
    ])];
    if (argv.sourcemaps) {
        stream.push(gulp_sourcemaps.init(
            extend({loadMaps: true}, argv.sourcemaps)
        ));
    }
    if (argv.sass || argv.sass === undefined) {
        stream.push(gulp_sass.apply(
            this, [extend({outputStyle: 'compressed'}, argv.sass)]
        ).on('error', gulp_sass.logError));
    }
    if (argv.sourcemaps) {
        stream.push(gulp_sourcemaps.write(
            './'
        ));
    }
    stream.push(gulp.dest(
        path.join('build', pkg.name, 'style')
    ));
    pump(stream, cb);
});
