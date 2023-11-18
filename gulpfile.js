const autoprefixer = require('autoprefixer')
const concat = require('gulp-concat')
const csso = require('gulp-csso')
const del = require('del')
const gulp = require('gulp')
const gulpWebp = require('gulp-webp')
const imagemin = require('gulp-imagemin')
const order = require('gulp-order')
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify-es').default
const sass = require('gulp-sass')(require('sass'))
const sourcemap = require('gulp-sourcemaps')
const svgstore = require('gulp-svgstore')
const sync = require('browser-sync').create()

const clean = () => {
  return del('dist')
}

const copy = () => {
  return gulp
    .src(
      [
        'src/fonts/**/*.{woff,woff2}',
        'src/img/*.{jpg,png}',
        'src/img/*.{webm,webp}'
      ],
      { base: 'src' }
    )
    .pipe(gulp.dest('dist'))
}

const cssWrp = (arr) =>
  (css = (done) => {
    arr.forEach((item) => {
      return gulp
        .src(`src/scss/${item}/index.scss`)
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(sass.sync())
        .on('error', sass.logError)
        .pipe(postcss([autoprefixer({ remove: false })]))
        .pipe(rename(`${item}.css`))
        .pipe(sourcemap.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(sync.stream())
        .pipe(csso())
        .pipe(rename(`${item}.min.css`))
        .pipe(gulp.dest('dist/css'))
    })
    done()
  })

const images = () => {
  return gulp
    .src('src/img/*.{png,jpg,svg}')
    .pipe(
      imagemin(
        [
          imagemin.optipng({ optimizationLevel: 3 }),
          imagemin.mozjpeg({ progressive: true }),
          imagemin.svgo({
            plugins: [{ removeUnknownsAndDefaults: false }]
          })
        ],
        {
          silent: true
        }
      )
    )
    .pipe(gulp.dest('dist/img'))
}

const webp = () => {
  return gulp
    .src('src/img/*.{png,jpg}')
    .pipe(gulpWebp({ quality: 80 }))
    .pipe(gulp.dest('dist/img'))
}

const sprite = () => {
  return gulp
    .src('src/img/icon-*.svg')
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest('dist/img'))
}

const js = () => {
  return gulp
    .src('src/js/*.js')
    .pipe(order(['utils.js', '*.js']))
    .pipe(concat(`script.js`))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename(`script.min.js`))
    .pipe(gulp.dest('dist/js'))
}

const html = () => {
  return gulp
    .src('src/pug/pages/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('dist'))
}

const refresh = (done) => {
  sync.reload()
  done()
}

const server = () => {
  sync.init({
    server: 'dist/',
    notify: false,
    open: false,
    cors: true,
    ui: false
  })

  gulp.watch('src/pug/**/*.{pug,js}', gulp.series(html, refresh))
  gulp.watch('src/img/icon-*.svg', gulp.series(sprite, html, refresh))
  gulp.watch('src/scss/**/*.scss', gulp.series(cssWrp(['style', 'dev'])))
  gulp.watch('src/js/**/*.js', gulp.series(js, refresh))
}

const build = gulp.series(
  clean,
  copy,
  cssWrp(['style', 'dev']),
  js,
  images,
  webp,
  sprite,
  html
)

const dev = gulp.series(build, server)

exports.build = build
exports.dev = dev
