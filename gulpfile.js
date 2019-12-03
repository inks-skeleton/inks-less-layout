// 引入npm资源
const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const gulpRename = require('gulp-rename')
const gulpLess = require('gulp-less')
const lessAutoprefix = require('less-plugin-autoprefix')
const gulpMinifyCSS = require('gulp-minify-css')
const del = require('del')
const package = JSON.parse(fs.readFileSync('./package.json'))

const autoprefix = new lessAutoprefix({ browsers: ['last 2 versions'] })
const outFile = path.join(__dirname, 'dist')
const devLess = path.join(__dirname, 'src/LayoutSimple.less')

// 清理输出文件夹
gulp.task('clean-dist', (done) => {
	return del([outFile], done)
})

// 编译less样式为css
gulp.task('less2css', () => {
	return gulp
		.src(devLess)
		.pipe(gulpLess({
      plugins: [autoprefix]
    }))
    .pipe(gulpRename((path) => {
			path.basename += '.' + package.version
		}))
		.pipe(gulp.dest(outFile))
});

// 编译less样式为min.css
gulp.task('less2mincss', () => {
	return gulp
		.src(devLess)
		.pipe(gulpLess({
      plugins: [lessAutoprefix]
    }))
		.pipe(gulpMinifyCSS())
		.pipe(gulpRename((path) => {
			path.basename += '.' + package.version + '.min'
		}))
		.pipe(gulp.dest(outFile))
})

// 打包
gulp.task('build', gulp.series('clean-dist', gulp.parallel('less2css', 'less2mincss')))
