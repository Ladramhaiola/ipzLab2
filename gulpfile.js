var gulp = require('gulp'),
minifyHtml = require('gulp-minify-html'),
minifyCss = require('gulp-minify-css'),
concat = require('gulp-concat'),
babel = require('gulp-babel-minify'),
rename = require('gulp-rename'),
notify = require('gulp-notify'),
del = require('del'),
livereload = require('gulp-livereload')
webserver = require('gulp-webserver')

gulp.task('serve', ()=>{
    gulp.src('public/html')
    .pipe(webserver({
        livereload: true,
        directoryListing: false,
        open: true,
        host: 'localhost',
        port: 8080,
        fallback: 'index.min.html'
    }))
})

gulp.task('default', ['watch', 'serve'])

gulp.task('minify-html', ()=>{
    gulp.src('./assets/template/*.html')
    .pipe(minifyHtml())
    .pipe(concat('index.html'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./public/html/'))
    .pipe(notify({message:'HTML minification completed'}))
})

gulp.task('minify-css', ()=>{
    gulp.src('./assets/stylus/**/*.css')
    .pipe(minifyCss())
    .pipe(concat('style.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./public/'))
    .pipe(notify({message:'CSS minification completed'}))
})

gulp.task('minify-js', ()=>{
    gulp.src('./assets/js/*.js')
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('./public/js/'))
    .pipe(notify({message:'ES6 compilation and minification completed'}))
})

gulp.task('watch', ()=>{
    livereload.listen()
    gulp.watch('assets/template/**/*.html', ['minify-html']).on('change', livereload.changed)
    gulp.watch('assets/js/**/*.js', ['minify-js']).on('change', livereload.changed)
    gulp.watch('assets/stylus/css/**/*.css', ['minify-css']).on('change', livereload.changed)
})

gulp.task('optimize', ()=>{
    gulp.start('minify-css', 'minify-js', 'minify-html')
})

gulp.task('clean-public', ()=>{
    return del('public/*')
})
