'use strict';

const gulp     = require('gulp');
const options  = require('./tasks/options');
const browser  = require('browser-sync').create();
const del      = require('del');



/**
 * @section Docs
 */
function clean() {
    return del(options.paths.docs + '/*');
}

exports.clean = clean;
gulp.task('compile', require('./tasks/compile'));
gulp.task('package', gulp.series( clean, gulp.parallel( 'compile' ) ) );


/**
 * @section Sync
 */
function reload(done) {
    browser.reload();
    done();
}

function sync(done) {
    browser.init({
      server: {
         baseDir: options.paths.docs
      }
    });
    done();
}


/**
 * @section Watch
 */
function watch() {
  gulp.watch( options.paths.src + 'scss/**/*.scss',   gulp.series( 'compile', reload ) );
  gulp.watch( options.paths.src + 'js/**/*.js',       gulp.series( 'compile', reload ) );
  gulp.watch( options.paths.src + 'img/**/*.*',       gulp.series( 'compile', reload ) );
  gulp.watch( options.paths.src + 'templates/*.html', gulp.series( 'compile', reload ) );
  gulp.watch( options.paths.src + 'datas/**/*.json',  gulp.series( 'compile', reload ) );
}
exports.watch   = watch;
exports.default = gulp.series( 'compile', sync, watch );


/**
 * @section Test
 */
gulp.task('test', require('./tasks/tests'));


/**
 * @section Lint
 */
 gulp.task('lint', require('./tasks/lint'));


/**
 * @section Travis
 */
gulp.task('travis', require('./tasks/travis'));
