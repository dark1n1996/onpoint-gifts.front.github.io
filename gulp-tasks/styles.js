import { src, dest } from "gulp";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import shorthand from "gulp-shorthand";
import cleanCSS from "gulp-clean-css";
import plumber from "gulp-plumber";
import concat from "gulp-concat";

const styles = (done) => {
  src(["app/styles/base.scss", "app/styles/**/*.scss", "app/pages/**/*.scss"])
    .pipe(plumber())
    .pipe(concat("style.scss"))
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(shorthand())
    .pipe(cleanCSS({ debug: true }))
    .pipe(dest("dist/css"));
  done();
};

export default styles;
