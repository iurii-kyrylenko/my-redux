const gulp = require('gulp');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

const paths = {
  srcFiles: 'src/**/*',
  srcScripts: 'src/**/*.js',
  dist: 'dist',
  distFiles: 'dist/**/*',
  distScript: 'all.js'
}

gulp.task('clean', function () {
  return del(paths.distFiles);
});

gulp.task('copy:libs', ['clean'], function() {
  return gulp.src([
      'node_modules/expect/umd/expect.js'
    ])
    .pipe(gulp.dest('dist/lib'))
}); 

gulp.task('copy:assets', ['clean'], function() {
  return gulp.src([paths.srcFiles, '!' + paths.srcScripts])
    .pipe(gulp.dest(paths.dist))
}); 
 
gulp.task('compile', ['clean'], () => {
    return gulp.src(paths.srcScripts)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat(paths.distScript))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['copy:assets', 'copy:libs', 'compile']);
