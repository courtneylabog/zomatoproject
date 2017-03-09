const gulp = require("gulp"); //requiring gulp module
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const reload = browserSync.reload;

//styles task takes the tasks from the styles dev folder
//will log error when it appears
//then go through concat - gather and concat it into new file
//and finally, outputs to public folder

//this is sass and concat
gulp.task("styles", () => {
	return gulp.src("./dev/styles/**/*.scss")//instide styles folder, ,any folder thats in there and any file that ends in scss, deal with it
	.pipe(sass().on("error",sass.logError))
	.pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
	.pipe(concat("style.css"))
	.pipe(plumber())
	.pipe(gulp.dest("./public/styles"))
	.pipe(reload({stream: true}));
});

//dis is the babel thing
gulp.task("scripts", () => {
	return gulp.src("./dev/scripts/script.js")
		.pipe(babel({
			presets: ["es2015"]
		}))
		.pipe(plumber())
		.pipe(gulp.dest("./public/scripts"))
		.pipe(reload({stream: true}));
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: './'  
  })
});

gulp.task('watch', function() {
	gulp.watch('./dev/scripts/*.js', ['scripts']);
	gulp.watch('./dev/styles/*.scss', ['styles']);
 	gulp.watch('./*.html', reload);
});

gulp.src('./src/*.ext')
    .pipe(plumber())
    .pipe(coffee())
    .pipe(gulp.dest('./dist'));

gulp.task('default', ['browser-sync','styles', 'scripts', 'watch']);