var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    pump = require('pump'),
    babel = require('gulp-babel')

var jsDest = 'js';

gulp.task('default', function(cb) {
    pump([
            gulp.src([
                'src/preloader.js',
                'src/observer.js',
                'src/sprite.js'
            ]),
            // babel({ presets: ['env'] }),
            concat('Sprite.js'),
            gulp.dest(jsDest),
            uglify(),
            rename('Sprite.min.js'),
            gulp.dest(jsDest)
        ],
    cb);
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['default']);
});
