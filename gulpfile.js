var gulp = require('gulp');


// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gulp = require('gulp'),
  connect = require('gulp-connect'),
  bower = require('gulp-bower'),
  rev = require('gulp-rev'),
  handlebars = require('gulp-compile-handlebars'),
  rename = require('gulp-rename'),
  fs = require('fs');

var config = {
  bowerDir: './bower_components'
};

gulp.task('webserver', function() {
  connect.server();
});
// Lint Task
gulp.task('lint', function() {
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
gulp.task('bower', function() {
  return bower().pipe(gulp.dest(config.bowerDir));
});



// Compile Our Sass
gulp.task('css', function() {
  return gulp.src('scss/*.scss')
    /* .pipe(sass({
         style: 'compressed',
         includePaths: [
         './scss/',
           config.bowerDir + '/skeleton-sass/'
         ]
       }

     )
     .on('error', function(er){
         console.log(er);
     })) */

  .pipe(gulp.dest('css'));
});
var handlebarOpts = {
  helpers: {
    assetPath: function(path, context) {
      return ['/dist', context.data.root[path]].join('/');
    }
  }
};
gulp.task('compile index.html', function() {
  // read in our manifest file
  var manifest = JSON.parse(fs.readFileSync('dist/rev-manifest.json', 'utf8'));

  // read in our handlebars template, compile it using
  // our manifest, and output it to index.html
  return gulp.src('index.hbs')
    .pipe(handlebars(manifest, handlebarOpts))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./'));
});
// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src('js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('js/*.js', ['lint', 'scripts']);
  //  gulp.watch('scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'css', 'scripts','compile index.html', 'watch', 'webserver']);