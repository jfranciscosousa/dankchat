var gulp = require('gulp');
var exec = require('child_process').exec;
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');

var javascript = ['src/js/jquery-1.11.2.min.js','src/js/**/*.js'];
var stylesheets = ['src/css/**/*.css'];

/* jshint task would be here */

gulp.task('build-css', function() {
    return gulp.src(stylesheets)
        .pipe(concat('app.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/assets/stylesheets'));
});

gulp.task('build-js', function() {
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
        watch: ["dankchat.js", "data.js", 'public/*', 'public/*/**'],
        ext: 'js'
    }).on('restart', () => {
        gulp.src('server.js')
            .pipe(notify('Running the start tasks and stuff'));
    });
});

gulp.task('build', ['build-js', 'build-css']);

gulp.task('default', ['build-js', 'build-css', 'watch', 'server']);
