'use strict';

var gulp = require('gulp');
var del = require('del');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
var nodemon = require('gulp-nodemon');
var path = require('path');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

/**
 * Build (Webpack)
 */

gulp.task('clean:build', function () {
  del('./public/css/*');
  del('./public/js/*');
});

gulp.task('build-javascripts', ['clean:build', 'compile-sass'], function () {
  return gulp.src('./src/app/app.js')
    .pipe(webpack(webpackConfig))
    .on('error', function handleError (err) {
      this.emit('Error: ', err); // Recover from errors
    })
    .pipe(gulp.dest('./'));
});

gulp.task('compile-sass', function () {
  let sources = [
    './styles/**/*.scss'
  ];

  let task = gulp.src(sources)
    .pipe(concat('styles.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css/'));

  return task
});

gulp.task('watch-javascripts:build-javascripts', function () {
  return gulp.watch('./src/app/**/*', ['build-javascripts']);
});

gulp.task('watch-sass:compile-sass', function () {

  return gulp.watch('./styles/**/*.scss', ['compile-sass']);
});


/**
 * Node Server (Express)
 */

gulp.task('serve:node', function (done) {
  var babelPath = path.join(__dirname, 'node_modules/.bin/babel-node');
  nodemon({
            exec: babelPath + ' ./server.js',
            watch: ['server.js'],
            ext: 'js html'
          });
});

/**
 * Main tasks
 */

gulp.task('serve', ['serve:node']);

gulp.task('watch', [
                    'build-javascripts',
                    'watch-javascripts:build-javascripts',
                    'compile-sass',
                    'watch-sass:compile-sass'
]);

gulp.task('default', ['serve']);
