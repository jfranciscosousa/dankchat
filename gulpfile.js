var gulp = require("gulp");
var concat = require("gulp-concat");
var cleanCSS = require("gulp-clean-css");
var uglify = require("gulp-uglify");
//var sourcemaps = require("gulp-sourcemaps");
var nodemon = require("gulp-nodemon");
var notify = require("gulp-notify");
var bower = require("gulp-bower");
var gulpbabel = require("gulp-babel");
var gulpif = require("gulp-if");
const sourcemaps = require("gulp-sourcemaps");

var VENDOR_JS_DIRS = [
  "bower_components/jquery/dist/jquery.min.js",
  "bower_components/bootstrap/dist/js/bootstrap.min.js",
  "bower_components/Autolinker.js/dist/Autolinker.min.js",
  "bower_components/socket.io-client/dist/socket.io.min.js",
  "bower_components/Kappa.js/dist/kappa.min.js"
];
var VENDOR_CSS_DIRS = [
  "bower_components/bootstrap/dist/css/bootstrap.css"
];

gulp.task("bower", function () {
  return bower();
});

function buildCss(source, filename, destination) {
  return gulp.src(source)
    .pipe(cleanCSS())
    .pipe(concat(filename))
    .pipe(gulp.dest(destination));
}

function buildJs(source, filename, destination, babel) {
  return gulp.src(source)
    .pipe(sourcemaps.init())
    .pipe(gulpif(babel, gulpbabel({
      presets: ["es2015"],
    })))
    .pipe(uglify())
    .pipe(concat(filename))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(destination));
}

gulp.task("build-app-css", function () {
  return buildCss("src/assets/css/**/*.css", "app.css", "public/css");
});

gulp.task("build-app-js", function () {
  return buildJs("src/assets/js/**/*.js", "app.js", "public/js", true);
});

gulp.task("build-images", () => {
  return gulp.src(["src/assets/**/*.ico", "src/assets/**/*.jpg"])
    .pipe(gulp.dest("public/"));
});

gulp.task("build-sounds", () => {
  return gulp.src("src/assets/sounds/**")
    .pipe(gulp.dest("public/sounds"));
});

gulp.task("build-html", () => {
  return gulp.src("src/assets/**/*.html")
    .pipe(gulp.dest("public/"));
});

gulp.task("build-app", ["build-app-js", "build-app-css", "build-sounds", "build-images", "build-html"]);

gulp.task("build-vendor-css", function () {
  return buildCss(VENDOR_CSS_DIRS, "vendor.css", "public/css");
});

gulp.task("build-vendor-js", function () {
  return buildJs(VENDOR_JS_DIRS, "vendor.js", "public/js");
});

gulp.task("build-vendor", ["build-vendor-js", "build-vendor-css"]);

gulp.task("build", ["build-vendor", "build-app"]);

gulp.task("watch", function () {
  gulp.watch("src/**/*", ["build-app"]);
});

gulp.task("dev", ["build", "watch"], function () {
  // configure nodemon
  nodemon({
    // the script to run the app
    script: "src/server/dankchat.js",
    // this listens to changes in any of these files/routes and restarts the application
    watch: ["src/server/**"],
    ext: "js"
  }).on("restart", () => {
    gulp.src("server.js")
      .pipe(notify("Running the start tasks and stuff"));
  });
});

gulp.task("default", ["build"]);
