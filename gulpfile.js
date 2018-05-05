var gulp = require('gulp');
var concat = require('gulp-concat');                            //- 多个文件合并为一个；
var minifyCss = require('gulp-minify-css');                     //- 压缩CSS为一行；
var rev = require('gulp-rev');                                  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');   
var gulpSourcemaps = require('gulp-sourcemaps');     
var gulpLess = require('gulp-less');  
var babel = require("gulp-babel");  
var watch = require("gulp-watch");  
var rename = require('gulp-rename'); 
 

var fileinclude = require('gulp-file-include');


gulp.task('HTML', function () {
    gulp.src('./pages/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('views'));
});

gulp.task('html', function(){
    gulp.watch('pages/*.html', ['HTML']);
});


gulp.task('cssConcat', function() {                                //- 创建一个名为 concat 的 task
      gulp.src('./less/**/*.less')
          .pipe(gulpSourcemaps.init())//sourcemaps
          .pipe(concat('all.less'))
          .pipe(gulpSourcemaps.write())
          .pipe(gulp.dest('allLess/'))//- 需要处理的css文件，放到一个字符串数组里
          .pipe(gulpLess())//编译less
          .pipe(concat('style.min.css'))                            //- 合并后的文件名
          .pipe(gulp.dest('css'))                               //- 输出文件本地            
          .pipe(gulp.dest('./rev'));                         
});


gulp.task('taskES6', function(){
    gulp.src('ES6js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('js'));
});




gulp.task('ES6', function(){
    gulp.watch('ES6js/*.js', ['taskES6']);
});

 
    
gulp.task('default',['watch','babeljs']);


gulp.task('rev',['cssConcat'],function() {console.log(111)
    gulp.src(['./rev/rev-manifest.json', './src/index.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                                   //- 执行文件内css名的替换
        .pipe(gulp.dest('./build/'));                           //- 替换后的文件输出的目录
});



gulp.watch('./less/**/*.less', ['cssConcat']);
gulp.task('default', [ 'rev']);