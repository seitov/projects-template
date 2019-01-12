const gulp = require("gulp");
const pug = require("gulp-pug");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const del = require("del");
const gulpWebpack = require("gulp-webpack");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const browserSync = require("browser-sync").create();

const paths = {
  root: "./dist",
  templates: {
    pages: "./src/views/pages/*.pug",
    src: "./src/views/**/*.pug",
    dest: "./dist"
  },
  styles: {
    main: "./src/assets/styles/main.scss",
    src: "./src/assets/styles/**/*.scss",
    dest: "./dist/assets/styles"
  },
  scripts: {
    src: "./src/assets/scripts/**/*.js",
    dest: "./dist/assets/scripts"
  },
  images: {
    src: "./src/assets/images/**/*.*",
    dest: "./dist/assets/images"
  },
  fonts: {
    src: "./src/assets/fonts/**/*.*",
    dest: "./dist/assets/fonts"
  }
};

// слежка
function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.templates.src, templates);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
}

// следим за  папкой dist и релоадим браузер
function server() {
  browserSync.init({
    server: paths.root
  });
  browserSync.watch(paths.root + "/**/*.*", browserSync.reload);
}

// clear
function clean() {
  return del(paths.root);
}

// pug
function templates() {
  return gulp.src(paths.templates.pages)
    .pipe(pug({ pretty: true}))
    .pipe(gulp.dest(paths.root));
}

// images
function images() {
  return gulp
    .src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

// fonts
function fonts() {
  return gulp
    .src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest));
}

// scss
function styles() {
  return gulp
    .src(paths.styles.main)
    .pipe(sourcemaps.init())
    .pipe(postcss(require("./postcss.config")))
    .pipe(sourcemaps.write())
    .pipe(rename("main.min.css"))
    .pipe(gulp.dest(paths.styles.dest));
}

// webpack
function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest(paths.scripts.dest));
}

exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.clean = clean;

gulp.task(
  "default",
  gulp.series(
    clean,
    gulp.parallel(styles, templates, scripts, images, fonts),
    gulp.parallel(watch, server)
  )
);