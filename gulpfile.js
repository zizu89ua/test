var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var server = require('gulp-server-livereload');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uncss = require('gulp-uncss');
 
 gulp.task('concat', function () {
     return gulp.src([
         '!src/css/app.css', 
         '!src/css/ie.css', 
         '!src/css/fonts.css', 
         'src/css/reset.css',
         'src/css/main.css',
         'src/css/style.css',
         'src/css/style-table.css',
         'src/css/desktop.css'])
         .pipe(concat('app.css'))
         .pipe(gulp.dest('dist/css'));

 });
gulp.task('sass', function() {
    return sass('src/sass/*.scss', { sourcemap: true, style: 'compact' })
        .on('error', sass.logError)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        // .pipe(rename('app.css'))
        // .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css'));
});

gulp.task('js', function() {
    gulp.src([
        'src/js/app.js'])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});
gulp.task('js_v', function() {
    gulp.src([
            'src/js/app.js',
        ])
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('images', function(){
    return gulp.src([
        'src/img/**/*.png',
        'src/img/**/*.jpg'])
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});


gulp.task('pages', function(){
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

// gulp.task('uncss', function () {
//     return gulp.src('dist/css/app.css')
//         .pipe(uncss({
//             html: ['dist/*.html']
//         }))
//         .pipe(gulp.dest('dist/css'));
// });

gulp.task('webserver', function() {
    gulp.src('dist')
        .pipe(server({
            livereload: {
                enable: true,
                filter: function(filePath, cb) {
                    cb( !(/.DS_Store/.test(filePath)) );
                }
            },
            directoryListing: false,
            open: true,
            log: 'info',
            defaultFile: 'index.html'
        }));
});

gulp.task('default', function() {
    gulp.start('pages', 'js', 'js_v', 'sass', 'concat', 'images', 'webserver');
    gulp.watch('src/*.html', ['pages']);
    gulp.watch('src/js/*.js', ['js']); 
    gulp.watch('src/js/vendor/*.js', ['js_v']);
    gulp.watch('src/css/**/*.css', ['concat']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/images/**/*.*', ['images']);
});