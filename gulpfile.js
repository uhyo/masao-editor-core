var path=require('path');
var util=require('util');
var gulp=require('gulp');
var webserver=require('gulp-webserver');
var gulputil=require('gulp-util');
var gulpif=require('gulp-if');
var duration=require('gulp-duration');
var source=require('vinyl-source-stream');
var uglify=require('gulp-uglify');
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');


var del=require('del');
var changed=require('gulp-changed');
var sass=require('gulp-sass');
var rename=require('gulp-rename');
var replace=require('gulp-replace');
var concat=require('gulp-concat');

gulp.task('jsx',function(){
    return jsxCompiler(false);
});

gulp.task('watch-jsx',function(){
    return jsxCompiler(true);
});

gulp.task("mc_canvas-static",function(){
    return gulp.src("mc_canvas/Samples/*.gif")
    .pipe(changed("dist/"))
    .pipe(gulp.dest("dist/"));
});

gulp.task('mc_canvas-uglify',function(){
    return gulp.src(["mc_canvas/Outputs/CanvasMasao.js","mc_canvas/Outputs/CanvasMasao_v28.js"])
    .pipe(changed("dist/"))
    .pipe(uglify())
    .pipe(gulpif(function(file){
        return path.basename(file.path)==="CanvasMasao_v28.js";
    },replace("CanvasMasao","CanvasMasao_v28")))
    .pipe(gulp.dest("dist/"));
});

gulp.task('mc_canvas',['mc_canvas-static','mc_canvas-uglify'],function(){
    return gulp.src(["dist/CanvasMasao.js","dist/CanvasMasao_v28.js"])
    .pipe(concat("CanvasMasao.min.js"))
    .pipe(gulp.dest("dist/"));
});

gulp.task('static',function(){
    return gulp.src(["images/**/*"],{
        base:"images"
    })
    .pipe(changed("dist/images/"))
    .pipe(gulp.dest("dist/images/"));
});

gulp.task('html',function(){
    return gulp.src(["html/**/*"],{
        base:"html"
    })
    .pipe(changed("dist/"))
    .pipe(gulp.dest("dist/"));
});

gulp.task('css',function(){
    return gulp.src(["css/index.scss"])
    .pipe(sass({outputStyle:"compressed"}).on("error",sass.logError))
    .pipe(rename("css.css"))
    .pipe(gulp.dest("dist/"));
});

gulp.task('webserver',function(){
    gulp.src("dist")
    .pipe(webserver({
        port: 8000,
        livereload: true
    }));
});

gulp.task('clean',function(cb){
    del([
        "dist",
    ],cb);
});

gulp.task('watch',['watch-jsx','css','html','webserver'],function(){
    //w
    gulp.watch("html/*.html",['html']);
    gulp.watch("css/*.scss",['css']);
});

gulp.task('default',['jsx','css','mc_canvas','static']);

//jsx compiling
function jsxCompiler(watch){
    return gulp.src('./jsx/entrypoint.tsx')
    .pipe(gulpWebpack(Object.assign({watch}, require('./webpack.config.js')), webpack))
    .pipe(gulp.dest('./dist'));
    /*
    //init browserify bundler
    var opts={
        entries:[path.join(__dirname,"jsx/entrypoint.jsx")],
        extensions:[".js",".jsx"],
        basedir:__dirname,
    };

        opts.cache={};
        opts.packageCache={};
        opts.fullPaths=true;
    }
    var b=browserify(opts);
    if(watch){
        b=watchify(b);
    }
    //chain
    b.transform(babelify, {presets: ['es2015', 'react']});
    b.plugin(cssModulesify, {
        rootDir: __dirname,
        output: 'dist/cssm.css',
    });
    if (process.env.NODE_ENV === 'production'){
        b.transform(uglifyify,{global:true});
    }

    b.on('update',bundle);
    bundle();
    return b;

    function bundle(){
        gulputil.log('recompiling jsx');

        b
        .bundle()
        .on('error',function(err){
            console.error(err);
        })
        .pipe(duration("compiled jsx"))
        .pipe(source("components.js"))
        .pipe(gulp.dest("dist/"));
    }
   */
}
