var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefix = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	cleanCss = require('gulp-clean-css'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber');
(uglify = require('gulp-uglify')),
	(babel = require('gulp-babel')),
	(imgmin = require('gulp-imagemin'));

var paths = {
	styleSrc: 'src/styles/**/*.sass',
	styleDest: 'dist/assets/styles',

	htmlDest: 'dist/*.html',

	jsSrc: 'src/app/**/*.js',
	jsDest: 'dist/assets/app',

	imgSrc: 'src/images/*',
	imgDest: 'dist/assets/images'
};

gulp.task('default', ['serve']);

gulp.task('image-minify', function() {
	return gulp
		.src(paths.imgSrc)
		.pipe(imgmin())
		.pipe(gulp.dest(paths.imgDest));
});

gulp.task('sass', function() {
	return gulp
		.src(paths.styleSrc)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefix())
		.pipe(cleanCss({ compatibility: 'ie8' }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.styleDest));
});

gulp.task('javascript', function() {
	return (
		gulp
			.src(paths.jsSrc)
			.pipe(plumber())
			.pipe(concat('app.js'))
			.pipe(sourcemaps.init())
			// .pipe(babel({
			//     presets: ['env']
			/*}))*/
			// .pipe(uglify())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(paths.jsDest))
	);
});

gulp.task('serve', ['sass', 'javascript'], function() {
	browserSync.init({
		server: {
			baseDir: './dist'
		},
		notify: false
	});

	gulp.watch(paths.styleSrc, ['sass']);
	gulp.watch(paths.jsSrc, ['javascript']);
	gulp
		.watch([paths.htmlDest, paths.jsDest + '/*.js', paths.styleDest + '/*.css'])
		.on('change', browserSync.reload);
});
