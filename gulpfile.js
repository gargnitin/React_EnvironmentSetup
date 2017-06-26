"use strict"

var gulp = require('gulp');
var connect = require('gulp-connect'); // Launch local host in browser
var browserify = require('browserify'); // Bundles files in one js file.
var source = require('vinyl-source-stream'); // Use conventional text streams with Gulp
var browserSync = require('browser-sync').create(); // Refresh browser on file update
var inject = require('gulp-inject'); // inject generated js and css files into html
var plumber = require('gulp-plumber'); //show error on console
var clean = require('gulp-clean'); //Cleanup folder before generating new files in destination folder


var config = {
    port: 9005,
    baseurl: "http://localhost",
    path: {
        html: "./src/*.html",
        dist: "./dist",
        js : "./src/*.js",
        mainJs: './src/main.js'
    },
    injectConfig : {
            destAllJs : './dist/scripts/*.js',
            destAllCss : './dist/css/*.css',
            destAllHtml : './dist/*.html'
        },
};

function cleanup(folderpath){
    return gulp.src(folderpath, {read : false})
        .pipe(clean());
}

gulp.task('browser-sync', ['connect'], function() {
    browserSync.init({
        proxy: config.baseurl + ":" + config.port + "/"
    });
});


gulp.task('connect', ['inject'], function (){
     connect.server({
        root: ['dist'],
        port: config.port,
        base: config.baseurl
    });
});


gulp.task('inject', ['html'], function(){
    var sources = gulp.src([config.injectConfig.destAllJs, config.injectConfig.destAllCss], {read: false});
    return gulp.src(config.injectConfig.destAllHtml)
    .pipe(inject(sources, {relative : true}))
    .pipe(gulp.dest(config.path.dist))

});

gulp.task('html', ['js'], function(){
    cleanup(config.injectConfig.destAllHtml);

    return gulp.src(config.path.html)
    .pipe(gulp.dest(config.path.dist))
});

gulp.task('js', [], function() {
    var stream = browserify(config.path.mainJs)
        .transform("babelify", {presets: ["es2015", "react"]})
        .bundle()
        .pipe(plumber())
        //.on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.path.dist + '/scripts'))
        .pipe(browserSync.stream());
    return stream;
});
          
gulp.task('watch', ['browser-sync'], function(){
    var watcher = gulp.watch(config.path.js, ['js']).on('change', browserSync.reload);        
    var htmlWatcher = gulp.watch(config.path.html, ['inject']).on('change', browserSync.reload);
    
    watcher.on('change', function(event){
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    }) 
    
    htmlWatcher.on('change', function(event){
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    })
});

gulp.task('default', ['watch']);