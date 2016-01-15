var gulp = require('gulp')
var sass = require('gulp-sass')

gulp.task('build_css', function() {
  return gulp
    .src('./themes/ghostwriter/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./themes/ghostwriter/static/css/'))
})

gulp.task('default', ['build_css'])
