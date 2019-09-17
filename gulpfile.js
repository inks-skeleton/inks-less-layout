// 引入npm资源
const path = require('path');
const gulp = require('gulp');
const gulpRename = require('gulp-rename')
const gulpLess = require('gulp-less');
const gulpMinifyCSS = require('gulp-minify-css');
const del = require('del');

// 清理输出文件夹
gulp.task('clean-dist', (done) => {
	return del([config.output.file + '/**/*'], done);
});

// 编译less样式为css
gulp.task('less', () => {
	return gulp
		.src('./src/*.less')
		.pipe(gulpLess())
		.pipe(gulp.dest('./dist'));
});

gulp.task('less', () => {
	return gulp
		.src('./src/*.less')
		.pipe(gulpLess())
		.pipe(gulpMinifyCSS())
		.pipe(gulpRename((path) => {
			path.basename += "-min"
		}))
		.pipe(gulp.dest('./dist'));
});

// 打包
gulp.task('build', gulp.series('clean-dist', gulp.parallel('less')));
