const gulp = require("gulp"); //requiring gulp module
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const babel = require("gulp-babel");

//styles task takes the tasks from the styles dev folder
//will log error when it appears
//then go through concat - gather and concat it into new file
//and finally, outputs to public folder

gulp.task("styles", () => {
	return gulp.src("./dev/styles/**/*.scss")//instide styles folder, ,any folder thats in there and any file that ends in scss, deal with it
	.pipe(sass().on("error",sass.logError))
	.pipe(concat("style.css"))
	.pipe(gulp.dest("./public/styles"));
});

gulp.task("javascript", () => {
	return gulp.src("./dev/scripts/main.js")
		.pipe(babel({
			presets: ["es2015"]
		}))
		.pipe(gulp.dest("./public/scripts"))
});

gulp.task("watch", () => {
	gulp.watch("./dev/styles/**/*.scss", ["styles"]); //array of styles that we want it to run..
});

gulp.task("default", ["styles", "javascript", "watch"]);