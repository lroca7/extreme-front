const { src, dest } = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

exports.default = function() {
  return src('js/*.js')
    .pipe(concat('application.js'))
    .pipe(dest('output/'));
}