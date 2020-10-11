const gulp = require("gulp");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const cssmin = require("gulp-cssnano");
const prefix = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const imagemin = require("gulp-imagemin");

// Essential files/directory for development mode source file
const inputPath = "src/assets/sass/*.scss";
const outputPath = "src/assets/css";
const cssUrl = "style.css";
const watcherResource = "src/assets/sass/**/*";

//Essential file/directory for production mode
const production_outputPath = "dist/assets/css";

const sassOptions = {
  outputStyle: "expanded", //expanded,compressed
};

const prefixerOptions = {
  cascade: false,
};

// copy all html file for production
gulp.task("html", function () {
  return gulp.src("src/*.html").pipe(gulp.dest("dist"));
});

// copy all script file for production
gulp.task("script", function () {
  return gulp.src("src/assets/js/**/*.js").pipe(gulp.dest("dist/assets/js"));
});
// copy all image file for production
gulp.task("images", function () {
  return gulp
    .src("src/assets/img/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/assets/img"));
});

gulp.task("styles", function () {
  return (
    gulp
      .src(inputPath)
      // .pipe(sourcemaps.init())
      .pipe(sass(sassOptions))
      .pipe(prefix(prefixerOptions))
      .pipe(rename(cssUrl))
      .pipe(gulp.dest(outputPath))
      .pipe(cssmin())
      .pipe(rename({ suffix: ".min" }))
      // .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(outputPath))
  );
});

gulp.task("production_styles", function () {
  return gulp
    .src(inputPath)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(prefix(prefixerOptions))
    .pipe(rename(cssUrl))
    .pipe(gulp.dest(production_outputPath))
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(production_outputPath));
});

// development mode
gulp.task(
  "start",
  gulp.series("styles", function (done) {
    gulp.watch(watcherResource, gulp.parallel("styles"));
    done();
  })
);

//production mode
gulp.task(
  "production",
  gulp.series(gulp.parallel("html", "production_styles", "images", "script"))
);
