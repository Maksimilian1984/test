const gulp = require('gulp');
// плагин препроцессора
const less = require('gulp-less');
// плагин для склейки файлов
const concat = require('gulp-concat');
// плагин для расстановки префиксов
const autoprefixer = require('gulp-autoprefixer');
const postcss = require('gulp-postcss');
// плагин для минимизации css
const cleanCSS = require('gulp-clean-css');
// плагин для удоления
const del = require('del');
// плагин для виртуального сервера
const browserSync = require('browser-sync').create();
// плагин для оптимизации графики
const imagemin = require('gulp-imagemin');
// плагин для переименования файлов
const rename = require('gulp-rename');
// плагин для создания svg спрайта
const svgstore = require('gulp-svgstore');
const uglify = require('gulp-uglify');


const lessFiles = [
    './src/less/font.less',
    './src/less/body.less',
    './src/less/sidebar.less',
    './src/less/menu.less',
    './src/less/logo.less',
    './src/less/search.less',
    './src/less/user-menu.less',
    './src/less/sidebar-menu.less',
    './src/less/banner.less',
    './src/less/button.less',
    './src/less/cards-products.less',
    './src/less/catalog-main-page.less',
    './src/less/news.less',
    './src/less/send-email.less',
    './src/less/about-us.less',
    './src/less/footer.less'


]

 gulp.task('styles',  function() {

    return gulp.src(lessFiles)
         //конкатенация склеиваем файлы
        .pipe(concat('style.less'))
        //преобразуем less в css
        .pipe(less())
        //расстовляем префиксы
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./build/css'))
        //оптимизируем css
        .pipe(cleanCSS({level: 2
        }))

        .pipe(rename('style.min.css'))
        // сохраняем фаил gulp
        .pipe(gulp.dest('./build/css'))

        .pipe(browserSync.stream())


});
// оптимизируем графический контент
gulp.task('image-compressor', function () {
    return gulp.src('./src/img/**')
        .pipe(imagemin({
        progressive: true,
            optimizationLevel: 3
    }))
        .pipe(gulp.dest('./build/img/'))

})
// какаято фигня надо разобраться
gulp.task('sprite', function () {
    return gulp.src('./sprite/*.svg')

        .pipe(svgstore({ inlineSvg: true }))
        .pipe(gulp.dest('./sprite/1/'))
})

//очищаем папку  build
gulp.task('clean', function () {
    return del(['build'])
})

// создаем виртуальный сервер
gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }});
// отслеживаем изменение файлов
    gulp.watch('./src/img/**', gulp.series('image-compressor'))
    gulp.watch('./src/less/**/*.less', gulp.series('styles'));
    gulp.watch('./src/js/**/*.js', gulp.series('java'))
    gulp.watch('./*.html').on('change', browserSync.reload);


});

gulp.task('copy', function () {
    return gulp.src([
        'src/font/**/*'
    ], {
        base: 'src'
    })
        .pipe(gulp.dest('build/'));

})

gulp.task('java', function () {
    return gulp.src([
        'src/js/**/*.js'])

        .pipe(gulp.dest('build/js'));

})





gulp.task('start', gulp.series('clean', gulp.parallel('styles', 'copy', 'image-compressor'  ), 'watch'));





