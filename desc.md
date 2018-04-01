# GULP

___

Gulp - это таск-менеджер для автоматического выполнения часто используемых задач (например, минификации, конкатенации и препроцессинга CSS файлов), написанный на JavaScript. Для запуска задач используется командная строка. От Grunt отличается тем, что код задач записывается не в стиле конфигурационного файла, а в виде JavaScript кода.

Gulp построен вокруг концепции потоковой передачи данных. Основное преимущество потоковой передачи в том, что она не создает промежуточные папки и файлы, что сильно ускоряет быстродействие таск-менеджера.

Установка Gulp при помощи npm:

- необходимо установить Gulp глобально:

    ```bash
    $ npm install -g gulp
    ```

- Затем указать его в зависимостях проекта:

    ```bash
    $ npm install --save-dev gulp
    ```
- Далее создаем файл gulpfile.js в корне проекта:

    ```javascript
    var gulp = require('gulp')

    gulp.task('default', () => {
        // что-то
    })
    ```

- Запуск

    ```bash
    $ gulp
    ```

    В таком случае запустится задача 'default'\
    Для запуска индивидуальных задач: gulp \<task> \<othertask>

___

## gulp API

Основные функции:

- gulp.src
- gulp.dest
- gulp.task
- gulp.watch

### gulp.src(_globs[,options]_)

Считывает файлы совпадающие с заданным паттерном **_globs_** и возвращает их в виде потока **Vinyl** файлов, которые потом могут быть обработаны плагинами через **gulp.pipe**.

Например:

```javascript
gulp.src('assets/*.js')
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('./public'))
```

Данный код считывает все файлы в папке **assets** с расширением **.js**

**Опции** [Object]:
Gulp поддерживает все опции поддерживаемые **node-glob**

```javascript
gulp.src('assets/*.js', {since: *somedate*})
```

Например, в таком случае **src** считает только файлы модифицированные после указанной даты *'somedate'*

### gulp.dest(_path[,options]_)

Записывает файлы с потока в указанное место, несуществующие папки создаются.

```javascript
gulp.src('assets/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/minified_js'))
    .pipe(// can continue)
    ...
```

**path** [string] или функция которая возвращает строку

### gulp.task(_name[,dependencies, function]_)

Создает задачу

```javascript
gulp.task('minify-js', ['babel'], () => {
    return gulp.src('build/es5/app.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/minified_js'))
})
```

Данный код создает задачу **'minify-js'**, поскольку в зависимостях указана задача **'babel'**, она будет выполнена перед запуском **'minify-js'**. Функция реализует операции задачи. Функция обработки должна возвращать Promise, callback или поток.

### gulp.watch(_glob[,options],tasks_)

Наблюдает за файлом и выполняет указанное действие когда в файл вносят изменения

```javascript
let watcher = gulp.watch('assets/*.js', ['minify-js'])
watcher.on('change', (event) => {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
})
```

## Рабочий пример

Зависимости

```javascript
var gulp = require('gulp')
var minHtml = require('gulp-minify-html')
var minCss = require('gulp-minify-css')
var babel = require('gulp-babel-minify')
var concat = require('gulp-concat')
var rename = require('gulp-rename')
```

Препроцессинг, минификация и конкатенация CSS файлов

```javascript
gulp.task('styles', () => {
    return gulp.src('./assets/stylus/*.styl')
        .pipe(stylus())
        .pipe(minCss())
        .pipe(concat('style.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public'))
})
```

То же самое с JS + (ES6 -> ES5)

```javascript
gulp.task('js', ()=>{
    return gulp.src('./assets/js/*.js')
        .pipe(babel())
        .pipe(concat('app.js'))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('./public'))
        .pipe(notify({message:'ES6 compilation and minification completed'}))
})
```

Миникация HTML + пример работы

- gulp.debug() выводит информацию о происходящем
- ignore.exclude(pattern) не пропускает дальше в поток файлы соответствующие паттерну

```javascript
gulp.task('html', ()=>{
    return gulp.src('./assets/template/*.html') // read all files matching given pattern
        .pipe(debug({title: 'src'}))            // show what is going on
        .pipe(ignore.exclude('*.min.html'))     // ignore already min files
        .pipe(minifyHtml())
        .pipe(debug({title: 'minify'}))
        .pipe(concat('index.html'))          // compile all html files to single
        .pipe(debug({title: 'concat'}))
        .pipe(rename({suffix: '.min'}))      // fname +.min +.html
        .pipe(gulp.dest('./public'))         // write result to destination folder
})
```

Пример задачи которая запускает список других задач

```javascript
gulp.task('optimize', ()=>{
    gulp.start('styles', 'js', 'html')
})

gulp.task('clean', ()=>{
    return del('{public,build}/*')
})
```

