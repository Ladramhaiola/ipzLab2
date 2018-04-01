var gulp = require('gulp'),
minifyHtml = require('gulp-minify-html'),
minifyCss = require('gulp-minify-css'),
concat = require('gulp-concat'),
babel = require('gulp-babel-minify'),
rename = require('gulp-rename'),
notify = require('gulp-notify'),
del = require('del'),
livereload = require('gulp-livereload')
webserver = require('gulp-webserver'),
vinyl = require('vinyl'),
stylus = require('gulp-stylus'),
debug = require('gulp-debug'),
sourcemap = require('gulp-sourcemaps'),
gulpIf = require('gulp-if'),
ignore = require('gulp-ignore'),
newer = require('gulp-newer')

gulp.task('serve', ()=>{
    gulp.src('public')
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

gulp.task('html', ()=>{
    return gulp.src('./assets/template/*.html') // read all files matching given pattern
    .pipe(debug({title: 'src'}))                // show what is going on
    .pipe(ignore.exclude('*.min.html'))         // ignore already min files
    .pipe(minifyHtml())
    .pipe(debug({title: 'minify'}))
    .pipe(concat('index.html'))          // compile all html files to single
    .pipe(debug({title: 'concat'}))
    .pipe(rename({suffix: '.min'}))      // fname +.min +.html
    .pipe(gulp.dest('./public'))         // write result to destination folder
    // .pipe(notify({message:'HTML minification completed'}))
})

gulp.task('styles', ()=>{
    return gulp.src('./assets/stylus/*.styl')
    .pipe(sourcemap.init())
    .pipe(stylus())
    .pipe(minifyCss())
    .pipe(concat('style.css'))
    .pipe(sourcemap.write())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./public'))
    // .pipe(notify({message:'CSS minification completed'}))
})

gulp.task('js', ()=>{
    return gulp.src('./assets/js/*.js')
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('./public'))
    // .pipe(notify({message:'ES6 compilation and minification completed'}))
})

gulp.task('watch', ()=>{ // recompile files on changes and livereload them
    livereload.listen()
    gulp.watch('assets/template/**/*.html', ['html']).on('change', livereload.changed)
    gulp.watch('assets/js/**/*.js', ['js']).on('change', livereload.changed)
    gulp.watch('assets/stylus/*.styl', ['styles']).on('change', livereload.changed)
})

gulp.task('optimize', ()=>{
    gulp.start('styles', 'js', 'html')
})

gulp.task('clean', ()=>{
    return del('{public,build}/*')
})
