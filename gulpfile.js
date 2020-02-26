// LayoutSimple gulp 插件测试
const path = require("path");
const del = require("del");
const gulp = require("gulp");
const gulpLess = require("gulp-less");
const gulpMinifyCSS = require("gulp-minify-css");
const LessAutoprefix = require("less-plugin-autoprefix");
const GulpLayoutSimple = require("./packages/gulp/index");

const outUrl = path.join(__dirname, "demo/dist_gulp");
const autoprefix = new LessAutoprefix({
  browsers: ["last 2 versions"]
});
const layoutsimple = new GulpLayoutSimple();

gulp.task("clean", done => {
  return del([outUrl], done);
});

gulp.task("lsLess", () => {
  return (
    gulp
      .src("./test/less/**/*.less")
      .pipe(layoutsimple.createLess())
      .pipe(
        gulpLess({
          plugins: [autoprefix]
        })
      )
      .pipe(gulpMinifyCSS())
      .pipe(gulp.dest(outUrl))
  );
});

gulp.task("lsJs", () => {
  return gulp
    .src("./test/js/**/*.js")
    .pipe(layoutsimple.adaptation())
    .pipe(gulp.dest(outUrl));
});
gulp.task("default", gulp.series("clean", gulp.parallel("lsLess", "lsJs")));
