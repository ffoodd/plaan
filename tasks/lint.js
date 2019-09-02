const gulp     = require('gulp');
const eslinter = require('gulp-eslint');
const linter   = require('gulp-stylelint');
const options  = require('./options');

function eslint() {
    return gulp.src(options.paths.src + 'js/**/*.js')
    .pipe(eslinter());
}

function stylelint() {
    return gulp.src(options.paths.src + 'scss/**/*.scss')
    .pipe(linter(options.stylelint));
}

module.exports = gulp.parallel( eslint, stylelint );
