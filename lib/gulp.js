
'use strict'
let clean = require('gulp-clean')
let gulp = require('gulp')
let copy = require('gulp-copy')
let rename = require('gulp-rename')
let cssmin = require('gulp-cssmin')
let uglify = require('gulp-uglify')
let connect = require('gulp-connect')
let compass = require('gulp-compass')
let prefix = require('gulp-autoprefixer')
let concat = require('gulp-concat')
let jshint = require('gulp-jshint')
let changed = require('gulp-changed')
// let webpack = require('@ali/alimusic-webpack-stream')
let named = require('vinyl-named')
// path
let paths = {
  dest: 'build/',
  src: 'src',
  scripts: ['src/*/*.js', '!src/**/*-min.js', '!src/script/**/*'],
  sassRoot: ['src/**/*.scss', '!src/**/_*.scss','!src/script/**/*'],
  cssRoot: ['src/**/*.css', '!src/**/_*.css','!src/script/**/*'],
  images: ['src/*.*','!src/script'],
  webpackJs:['src/*/*.js','!src/**/*-min.js', '!src/vendor/**/*.js','!src/script/**/*']
}
let series = gulp.series
let parallel = gulp.parallel

// clean
gulp.task('clean', function() {
  return gulp.src('build/')
    .pipe(clean({force: true}))
})

// connect
gulp.task('connect', function() {
  return connect.server({
    // root: './',
    livereload: true,
    port:8081
  })
})

// css
gulp.task('scss', function() {
  return gulp.src(paths.sassRoot)
    .pipe(compass({
      css: 'src',
      sass: 'src',
      image: 'src'
    }))
    .pipe(gulp.dest(paths.src))
    .pipe(connect.reload())
})

// prefix
gulp.task('prefix', series('scss',function () {
  return gulp.src(paths.cssRoot)
    .pipe(cssmin())
    .pipe(gulp.dest(paths.dest))
    .pipe(connect.reload())

}))

// copy images
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(copy(paths.dest, {
      prefix: 1
    }))
    .pipe(connect.reload())
})

// copy js
gulp.task('copyJs', function() {
  return gulp.src('src/script/**/*').pipe(gulp.dest(paths.dest + '/script'))
})

// reload for html
gulp.task('html', function() {
  return gulp.src('./demo/*.html')
    .pipe(connect.reload())
})

// return the task when a file changes
gulp.task('watch', function() {
  gulp.watch(['src/**/*.scss'], parallel('prefix'))
  gulp.watch(paths.scripts, parallel('uglifyJs'))
  gulp.watch(paths.images, parallel('images'))
  gulp.watch(['./demo/*.html'], parallel('html'))
})

// local debug watch
gulp.task('localWatch', function() {
  gulp.watch(['src/**/*.scss'], parallel('prefix'))
  gulp.watch(paths.scripts, parallel('localUglifyJs'))
  gulp.watch(paths.images, parallel('images'))
  gulp.watch(['./demo/*.html'], parallel('html'))
})

// uglify js
gulp.task('uglifyJs', function() {
  return gulp.src(paths.scripts)
  // .pipe(jshint('.jshintrc'))
  // .pipe(jshint.reporter(stylish))
    .pipe(named())
    // .pipe(webpack((require('./webpack.config.js'))('production')))
    // .pipe(uglify())
    .pipe(gulp.dest(paths.dest))
    .pipe(connect.reload())
})

gulp.task('localUglifyJs', function() {
  return gulp.src(paths.scripts)
  // .pipe(jshint('.jshintrc'))
    .pipe(changed(paths.dest))
    // .pipe(named())
    // .pipe(webpack((require('./webpack.config.js'))('local')))
    .pipe(gulp.dest(paths.dest))
    .pipe(connect.reload())
})


// default
gulp.task('default', series('clean',parallel('uglifyJs', 'prefix', 'images', 'copyJs')))
// serve
gulp.task('serve', parallel('connect', 'watch'))
gulp.task('localServe',parallel('connect', 'localWatch'))