var gulp          = require('gulp');
var sass          = require('gulp-sass');
var globbing      = require('gulp-css-globbing');
var autoprefixer  = require('gulp-autoprefixer');
var plumber       = require('gulp-plumber');
var greplace      = require('gulp-replace');
var sourcemaps    = require('gulp-sourcemaps');
var browserSync   = require('browser-sync').create();

gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: {
      baseDir: "../"
    }
  });
});

gulp.task('sass', function() {
  gulp.src(['./sass/*.scss', './sass/**/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(globbing({
      extensions: ['.scss']
    }))
    .pipe(greplace(/^\s*(@import\s+)?url\((["'][^"'\)]+['"])(?:\))?(;)?\s*$/gm, '$1$2$3'))
    .pipe(sass({
      includePaths: ['./sass/*.scss'],
      errLogToConsole: true,
      outputStyle: 'compact'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie >= 6', 'chrome >= 4', 'ff >= 3'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('../css'))
    .pipe(browserSync.stream());
});

gulp.watch(['./sass/*.scss', './sass/**/**/*.scss'], ['sass']).on('change', browserSync.reload);
gulp.watch(['../*.html'], ['serve']).on('change', browserSync.reload);

gulp.task('default', ['serve']);
