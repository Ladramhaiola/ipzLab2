var gulp = require('gulp'),
minifyHtml = require('gulp-minify-html'),
minifyCss = require('gulp-minify-css'),
concat = require('gulp-concat'),
babel = require('gulp-babel-minify'),
rename = require('gulp-rename'),
notify = require('gulp-notify'),
del = require('del'),
livereload = require('gulp-livereload')

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

gulp.task('optimize', ()=>{
    gulp.start('minify-css', 'minify-js', 'minify-html')
})

gulp.task('clean-public', ()=>{
    return del('public/*')
})
