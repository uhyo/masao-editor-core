var path=require('path');
var util=require('util');
var gulp=require('gulp');
const debug=require('gulp-debug');
var webserver=require('gulp-webserver');
var gulpif=require('gulp-if');
var duration=require('gulp-duration');
var uglify=require('gulp-uglify');
const webpack = require('webpack');
const gulp_tcm = require('gulp-typed-css-modules');
const gulp_ts = require('gulp-typescript');


var del=require('del');
var changed=require('gulp-changed');
var rename=require('gulp-rename');
var replace=require('gulp-replace');
var concat=require('gulp-concat');
const merge2 = require('merge2');

gulp.task('jsx', ['tsc'], ()=>{
    return jsxCompiler(false);
});

gulp.task('watch-jsx', ['tsc'], ()=>{
    return jsxCompiler(true);
});

const tsProject = gulp_ts.createProject('tsconfig.json');
const tsTarget = [
    './actions/**/*.ts',
    './logics/**/*.ts',
    './scripts/**/*.ts',
    './stores/**/*.ts',
    './jsx/**/*.ts{,x}',
];

gulp.task('tsc', ()=>{
    const stream = gulp.src(tsTarget, {
        base: '.',
    }).pipe(tsProject());
    return merge2([
        stream.js.pipe(gulp.dest('dist-es6/')),
        stream.dts.pipe(gulp.dest('dist-types/')),
    ]);
});
gulp.task('watch-tsc', ['tsc'], ()=>{
    gulp.watch(tsTarget, ['tsc']);
});
gulp.task('build-files', ()=>{
    return gulp.src(['images/**/*', 'jsx/**/*.css'], {
        base: '.',
    })
    .pipe(changed('dist-es6/'))
    .pipe(gulp.dest('dist-es6/'));
});
gulp.task('watch-build-files', ['build-files'], ()=>{
    gulp.watch(['images/**/*', 'jsx/**/*.css'], ['build-files']);
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

gulp.task('html',function(){
    return gulp.src(["html/**/*"],{
        base:"html"
    })
    .pipe(changed("dist/"))
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

gulp.task('watch',['tcm', 'watch-tsc', 'watch-build-files', 'watch-jsx', 'html'],function(){
    //w
    gulp.watch('html/*.html', ['html']);
    gulp.watch('jsx/**/*.css', ['tcm']);
});

gulp.task('default',['tcm', 'tsc', 'build-files', 'jsx', 'mc_canvas']);

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
