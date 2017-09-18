const browserSync = require("browser-sync").create();
const gulp = require("gulp");

// for css
const sass = require("gulp-sass");

// for JavaScript
var browserify = require("browserify");
var buffer = require("gulp-buffer");
var tap = require("gulp-tap");

gulp.task("default", ["sass", "js"], () => {
    // launch develop local server
    browserSync.init({
        proxy: "http://127.0.0.1:3000/",
        port: 8000
    });

    // watch styles folder to compile sass files
    gulp.watch(["src/sass/*.scss", "src/sass/**/*.scss"], ["sass"]);
    // watch styles folder to compile js files
    gulp.watch(["src/js/*.js", "src/js/**/*.js"], ["js"]);
    // watch ejs views
    gulp.watch(["views/*.ejs", "views/**/*.ejs"]).on('change', browserSync.reload);
});

gulp.task("sass", () => {
    gulp.src(['src/sass/*.scss'])
        // compile sass
        .pipe(sass().on("error", sass.logError))
        // copy to dest folder
        .pipe(gulp.dest('public/css/'))
        // and reload browser
        .pipe(browserSync.stream());
    });

gulp.task("js", () => {
    gulp.src("src/js/main.js")
        // tap allows to apply a function to every file
        .pipe(tap(function (file) {
            // replace content file with browserify result
            file.contents = browserify(file.path, {
                    debug: true
                }) // new browserify instance
                .transform("babelify", {
                    presets: [
                        ["env", {
                            "targets": {
                                "browsers": ["last 2 versions"]
                            }
                        }]
                    ]
                }) // ES6 -> ES5
                .bundle() // compile
                .on("error", (error) => { console.error(error); }) // treat errors showing on console
        }))
        // back file to gulp buffer to apply next pipe
        .pipe(buffer())        // copy to dest folder
        .pipe(gulp.dest("public/js/"))
        // and reload browser
        .pipe(browserSync.stream());
});