const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const browserSync = require('browser-sync').create();
const cheerio = require('gulp-cheerio');
const svg_sprite = require('gulp-svg-sprite');
const replace = require('gulp-replace');
const svgmin = require('gulp-svgmin');
const autoprefixer = require('gulp-autoprefixer');
const pngQuant = require('imagemin-pngquant');
const imageMin = require('gulp-imagemin');
const cache = require('gulp-cache');


//pug
const paths = {
    root: './build',
    templates: {
        pages: 'app/templates/pages/*.pug',
        src: 'app/templates/**/*.pug',
        dest: 'build/assets/'
    },
    styles: {
        src: 'app/scss/**/*.scss',
        dest: 'build/assets/css/'
    },
    svg: {
        src: 'app/pic/icons/*.svg',
        dest: 'build/assets/img/'
    },
    img: {
        src: 'app/pic/img/*.*',
        dest: 'build/assets/img/'
    },
    scripts: {
        src: 'app/js/**/*.js',
        dest: 'build/assets/js/'
    }
};

function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(paths.root));
};

//scss

function styles() {
    return gulp.src('app/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.styles.dest));
};

//картинки
function img() {
    return gulp.src(paths.img.src)
        .pipe(cache(imageMin({
            interlased: true,
            progressive: true,
            svgoPlugins: [{ removeVieBox: false }],
            une: [pngQuant()]
        })))
        .pipe(gulp.dest(paths.img.dest));
};

//спрайты 
const config = {
    mode: {
        symbol: {
            sprite: "../sprite.svg",
            example: {
                dest: '../svgDemo.html'
            }
        }
    }
};

function sprite() {
    return gulp
        .src(paths.svg.src)
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svg_sprite(config))
        .pipe(gulp.dest(paths.svg.dest));
};

function bg_svg() {
    return gulp
        .src('app/pic/icons/bg_svg/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(gulp.dest('build/assets/img/bg_svg'));
};

//fonts
function fonts() {
    return gulp.src('app/fonts/**/*.*')
        .pipe(gulp.dest('build/assets/fonts/'));
};



//очистка
function clean() {
    return del(paths.root);
}

//webpack
function scripts() {
    return gulp.src('app/js/app.js')
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest(paths.scripts.dest))
}


//следим за файлами из папки app
function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.img.src, img);
    gulp.watch(paths.svg.src, sprite);
    gulp.watch('app/fonts/**/*.*', fonts);
    gulp.watch('app/pic/icons/bg_svg/*.svg', bg_svg);
    gulp.watch(paths.scripts.src, scripts);
}

//сервер
function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

exports.templates = templates;
exports.styles = styles;
exports.clean = clean;
exports.sprite = sprite;
exports.img = img;
exports.bg_svg = bg_svg;
exports.scripts = scripts;
exports.fonts = fonts;


gulp.task('default', gulp.series(
    gulp.parallel(styles, templates, fonts, img, sprite, bg_svg, scripts),
    gulp.parallel(watch, server)
));

gulp.task('build', gulp.series(
    clean,
    gulp.parallel(styles, templates, fonts, img, bg_svg, sprite, scripts)
));