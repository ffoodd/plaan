const fs       = require('fs');
const gulp     = require('gulp');
const nunjucks = require('gulp-nunjucks-render');
const newer    = require('gulp-newer');
const data     = require('gulp-data');
const babel    = require('gulp-babel');
const uglify   = require('gulp-uglify');
const imgmin   = require('gulp-imagemin');
const sass     = require('gulp-sass');
const maps     = require('gulp-sourcemaps');
const csso     = require('gulp-csso');
const prefix   = require('gulp-autoprefixer');
const rename   = require('gulp-rename');
const purge    = require('gulp-purgecss');
const options  = require('./options');

function move() {
  return gulp.src(options.files)
    .pipe(gulp.dest(options.paths.docs))
}

function js() {
    return gulp.src(options.paths.src + 'js/**/*.js')
      .pipe(newer(options.paths.docs + 'js'))
      .pipe(babel(options.babel))
      .pipe(uglify().on('error', function(err) {
        console.error(`${err.cause.message} in ${err.cause.filename} at line ${err.cause.line}`);
        this.emit('end');
      }))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(options.paths.docs + 'js'));
}

function css() {
    return gulp.src(options.paths.src + 'scss/*.scss')
      .pipe(newer(options.paths.docs + 'css'))
      .pipe(maps.init())
      .pipe(sass(options.sass).on('error', sass.logError))
      .pipe(prefix(options.browsers))
      .pipe(csso(options.csso))
      .pipe(purge(options.purge))
      .pipe(rename({suffix: '.min'}))
      .pipe(maps.write())
      .pipe(gulp.dest(options.paths.docs + 'css'));
}

function img() {
    return gulp.src(options.paths.src + 'img/*')
      .pipe(newer(options.paths.docs + 'img'))
      .pipe(imgmin({verbose: true}))
      .pipe(gulp.dest(options.paths.docs + 'img'));
}

function getDatas() {
 return {
   casting: JSON.parse(fs.readFileSync('./src/datas/casting.json')),
   grid: JSON.parse(fs.readFileSync('./src/datas/grid.json'))
 };
}

function template() {
    return gulp.src(options.paths.src + 'templates/*.html')
      .pipe(data(getDatas))
      .pipe(newer(options.paths.docs))
      .pipe(nunjucks(options.nunjucks))
      .pipe(gulp.dest(options.paths.docs));
}

module.exports = gulp.series( move, gulp.parallel( css, img, js, template ) );
