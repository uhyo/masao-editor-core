var path=require('path');
var util=require('util');
var gulp=require('gulp');
const debug=require('gulp-debug');
var webserver=require('gulp-webserver');
var gulpif=require('gulp-if');
var duration=require('gulp-duration');
var uglify=require('gulp-uglify');
const webpack = require('webpack');
const sass = require('gulp-sass');
const gulp_tcm = require('gulp-typed-css-modules');


var del=require('del');
var changed=require('gulp-changed');
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

gulp.task('tcm', function(){
    return gulp.src(["jsx/**/*.css"], {
        base: '.',
    })
    .pipe(changed("./", {extension: '.css.d.ts'}))
    .pipe(gulp_tcm({
        camelCase: true,
    }))
    .pipe(gulp.dest("./"));
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

gulp.task('watch',['tcm', 'watch-jsx', 'css', 'html', 'webserver'],function(){
    //w
    gulp.watch('html/*.html', ['html']);
    gulp.watch('css/*.scss', ['css']);
    gulp.watch('jsx/**/*.css', ['tcm']);
});

gulp.task('default',['tcm', 'jsx', 'css', 'mc_canvas', 'static']);

//jsx compiling
function jsxCompiler(watch){
    /*
    return gulp.src('./jsx/entrypoint.tsx')
    .pipe(gulpWebpack(Object.assign({watch, verbose: true}, require('./webpack.config.js')), webpack))
    .pipe(debug({title:'jsxcompiler'}))
    .pipe(gulp.dest('./dist'));
   */
  const compiler = webpack(require('./webpack.config.js'));

  const handleStats = (stats, watch)=>{
      console.log(stats.toString({
          chunks: !watch,
          colors: true,
      }));
      /*
      const info = stats.toJson();

      if (stats.hasErrors()) {
          console.error(info.errors);
      }

      if (stats.hasWarnings()) {
          console.warn(info.warnings)
      }
     */
  };
  if (watch){
      const watching = compiler.watch({
      }, (err, stats)=>{
          if (err){
              console.error(err);
              return;
          }
          handleStats(stats, true);
      });
  }else{
      compiler.run((err, stats)=>{
          if (err){
              console.error(err);
              return;
          }
          handleStats(stats, false);
      });
  }
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
