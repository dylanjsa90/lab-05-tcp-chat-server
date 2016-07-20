const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

var testFiles = ['test/**/*.js'];
var appFiles = ['lib/**/*.js'];
var serverFile = ['server.js'];
gulp.task('lint:all', () => {
  gulp.src(testFiles)
    .pipe(eslint())
    .pipe(eslint.format());
  gulp.src(appFiles)
    .pipe(eslint())
    .pipe(eslint.format());
  gulp.src(serverFile)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('mocha', () => {
  gulp.src(testFiles)
    .pipe(mocha());
});

gulp.task('default', ['lint:all', 'mocha']);
