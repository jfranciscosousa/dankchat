var gulp = require('gulp');
var exec = require('child_process').exec;
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var bower = require('gulp-bower');

var javascript = [
    'src/lib/jquery/dist/jquery.js',
    'src/lib/bootstrap/dist/js/bootstrap.js',
    'src/lib/Autolinker.js/dist/Autolinker.js',
    'src/lib/socket.io-client/socket.io.js',
    'src/js/**/*.js'
];
var stylesheets = [
  'src/lib/bootstrap/dist/css/bootstrap.css',
  'src/lib/bootstrap/dist/css/bootstrap-theme.css',
  'src/css/**/*.css'
];

gulp.task('bower', function() {
    return bower();
});

/* jshint task would be here */

gulp.task('build-css', ['bower'], function() {
    return gulp.src(stylesheets)
        .pipe(concat('app.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/assets/stylesheets'));
});

gulp.task('build-js', ['bower'], function() {
    return gulp.src(javascript)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/assets/javascript'));
});

/* updated watch task to include sass */

gulp.task('watch', function() {
    gulp.watch(javascript, ['build-js']);
    gulp.watch(stylesheets, ['build-css']);
});

gulp.task('server', function() {
    // configure nodemon
    nodemon({
        // the script to run the app
        script: 'dankchat.js',
        // this listens to changes in any of these files/routes and restarts the application
        watch: ["dankchat.js", "data.js", 'src/*'],
        ext: 'js'
    }).on('restart', () => {
        gulp.src('server.js')
            .pipe(notify('Running the start tasks and stuff'));
    });
});

gulp.task('build', ['build-js', 'build-css']);

gulp.task('default', ['build-js', 'build-css', 'watch', 'server']);
