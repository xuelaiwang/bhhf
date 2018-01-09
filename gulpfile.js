const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const pkg = require('./package');
const version = `${pkg.version}.${Date.now()}`;
const connect = require('gulp-connect');//livereload
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const livereload = require('gulp-livereload');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const less = require("gulp-less")
const scripts = {
  src: 'src/js/*.js',
  output: './dist/js/main.js',
  dest: './dist/js',
};



const styles = {
  src: 'src/css/*.less',
  enter: '',
  output: './dist/css/main.css',
  dest: './dist/css',
};
const html = {
  src: 'src/html/*.html',
  dest: './dist',
};
const images = {
  src: 'src/images/**/*.{jpg,png,gif,jpeg}',
  dest: './dist/images',
};



gulp.task('clean', () => {
  return gulp.src('./dist')
    .pipe(plugins.clean());
});

gulp.task('css', () => {
  return gulp.src(styles.src)
    .pipe(plugins.autoprefixer({
      browsers: [
        'Chrome >= 35',
        'Firefox >= 31',
        'Edge >= 12',
        'Explorer >= 9',
        'iOS >= 8',
        'Safari >= 8',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12',
      ],
    }))
    .pipe(less())
    .pipe(gulp.dest(styles.dest))
    .pipe(connect.reload());
});
gulp.task('cssrelease', () => {
  return gulp.src(styles.src)
    .pipe(plugins.autoprefixer({
      browsers: [
        'Chrome >= 35',
        'Firefox >= 31',
        'Edge >= 12',
        'Explorer >= 9',
        'iOS >= 8',
        'Safari >= 8',
        'Android 2.3',
        'Android >= 4',
        'Opera >= 12',
      ],
    }))
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(gulp.dest(styles.dest))
});
gulp.task('html', () => {
  return gulp.src(html.src)
    .pipe(gulp.dest(html.dest))
    .pipe(connect.reload());
});
gulp.task('htmlrelease', () => {
  return gulp.src(html.src)
    .pipe(htmlmin({
      removeComments: true,//清除HTML注释
      collapseWhitespace: true,//压缩HTML
      removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
      minifyJS: true,//压缩页面JS
      minifyCSS: true//压缩页面CSS
    }))
    .pipe(gulp.dest(html.dest))
});
gulp.task('images', () => {
  return gulp.src(images.src)
    .pipe(imagemin({
      optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }))
    .pipe(gulp.dest(images.dest))
});
gulp.task('js', () => {
  return gulp.src(scripts.src)
    .pipe(gulp.dest(scripts.dest))
    .pipe(connect.reload());
});
gulp.task('jsrelease', () => {
  return gulp.src(scripts.src)
    .pipe(uglify({
      mangle:{
        toplevel: true //默认值false。
    },
      compress: true,//类型：Boolean 默认：true 是否完全压缩
    })) 
    .pipe(gulp.dest(scripts.dest))
});
gulp.task('release', ['htmlrelease', 'cssrelease', 'jsrelease','images']);

gulp.task('watch', () => {
  // livereload.listen();
  gulp.watch(scripts.src, ['js']);
  gulp.watch(styles.src, ['css']);
  gulp.watch(images.src, ['images']);
  gulp.watch(html.src, ['html']);
});

gulp.task('webserver',function() {
  connect.server({
      livereload:true,
      // port: 2333,
      root: './dist'
  });
});
gulp.task('default', ['webserver','watch']);
