var path = require('path');
var util = require('util');
var gulp = require('gulp');
const debug = require('gulp-debug');
var webserver = require('gulp-webserver');
var gulpif = require('gulp-if');
var duration = require('gulp-duration');
var uglify = require('gulp-uglify');
const webpack = require('webpack');
const gulp_tcm = require('gulp-typed-css-modules');
const gulp_ts = require('gulp-typescript');

var del = require('del');
var changed = require('gulp-changed');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
const merge2 = require('merge2');

const tsProject = gulp_ts.createProject('tsconfig.json');
const tsTarget = [
  './defs/**/*.ts',
  './actions/**/*.ts',
  './logics/**/*.ts',
  './scripts/**/*.ts',
  './stores/**/*.ts',
  './jsx/**/*.ts{,x}',
];

gulp.task('tsc', () => {
  const stream = gulp
    .src(tsTarget, {
      base: '.',
    })
    .pipe(tsProject());
  return merge2([
    stream.js.pipe(gulp.dest('dist-es6/')),
    stream.dts.pipe(gulp.dest('dist-types/')),
  ]);
});
gulp.task(
  'watch-tsc',
  gulp.series('tsc', () => {
    gulp.watch(tsTarget, gulp.task('tsc'));
  }),
);
gulp.task('build-files', () => {
  return gulp
    .src(['images/**/*', 'jsx/**/*.css'], {
      base: '.',
    })
    .pipe(changed('dist-es6/'))
    .pipe(gulp.dest('dist-es6/'));
});
gulp.task(
  'watch-build-files',
  gulp.series('build-files', () => {
    gulp.watch(['images/**/*', 'jsx/**/*.css'], gulp.task('build-files'));
  }),
);

gulp.task('mc_canvas-static', () => {
  return gulp
    .src('mc_canvas/Samples/*.gif')
    .pipe(changed('dist/'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('mc_canvas-uglify', () => {
  return gulp
    .src([
      'mc_canvas/Outputs/CanvasMasao.js',
      'mc_canvas/Outputs/CanvasMasao_v28.js',
    ])
    .pipe(changed('dist/'))
    .pipe(uglify())
    .pipe(
      gulpif(function(file) {
        return path.basename(file.path) === 'CanvasMasao_v28.js';
      }, replace('CanvasMasao', 'CanvasMasao_v28')),
    )
    .pipe(gulp.dest('dist/'));
});

gulp.task(
  'mc_canvas',
  gulp.series('mc_canvas-static', 'mc_canvas-uglify', () => {
    return gulp
      .src(['dist/CanvasMasao.js', 'dist/CanvasMasao_v28.js'])
      .pipe(concat('CanvasMasao.min.js'))
      .pipe(gulp.dest('dist/'));
  }),
);

gulp.task('html', () => {
  return gulp
    .src(['html/**/*'], {
      base: 'html',
    })
    .pipe(changed('dist/'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('tcm', () => {
  return gulp
    .src(['jsx/**/*.css'], {
      base: '.',
    })
    .pipe(changed('./', { extension: '.css.d.ts' }))
    .pipe(
      gulp_tcm({
        camelCase: true,
      }),
    )
    .pipe(gulp.dest('./'));
});

gulp.task('webserver', () => {
  gulp.src('dist').pipe(
    webserver({
      port: 8000,
      livereload: true,
    }),
  );
});

gulp.task('clean', cb => {
  del(['dist', 'dist-es6', 'dist-types'], cb);
});

gulp.task(
  'bundle',
  gulp.series('tsc', cb => {
    jsxCompiler(false, cb);
  }),
);

gulp.task(
  'watch-bundle',
  gulp.series('tsc', () => {
    return jsxCompiler(true);
  }),
);

gulp.task(
  'watch',
  gulp.series(
    'tcm',
    'watch-tsc',
    'watch-build-files',
    'watch-bundle',
    'html',
    () => {
      //w
      gulp.watch('html/*.html', gulp.task('html'));
      gulp.watch('jsx/**/*.css', gulp.task('tcm'));
    },
  ),
);
gulp.task(
  'watch-no-bundle',
  gulp.series('tcm', 'watch-tsc', 'watch-build-files', 'html', () => {
    //w
    gulp.watch('html/*.html', gulp.task('html'));
    gulp.watch('jsx/**/*.css', gulp.task('tcm'));
  }),
);

gulp.task(
  'default',
  gulp.series('tcm', 'tsc', 'build-files', 'bundle', 'mc_canvas'),
);

//jsx compiling
function jsxCompiler(watch, cb) {
  /*
    return gulp.src('./jsx/entrypoint.tsx')
    .pipe(gulpWebpack(Object.assign({watch, verbose: true}, require('./webpack.config.js')), webpack))
    .pipe(debug({title:'jsxcompiler'}))
    .pipe(gulp.dest('./dist'));
   */
  const compiler = webpack(require('./webpack.config.js'));

  const handleStats = (stats, watch) => {
    console.log(
      stats.toString({
        chunks: !watch,
        colors: true,
      }),
    );
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
  if (watch) {
    const watching = compiler.watch({}, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      handleStats(stats, true);
    });
  } else {
    compiler.run((err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      handleStats(stats, false);
      cb();
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
