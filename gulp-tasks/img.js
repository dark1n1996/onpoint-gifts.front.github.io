import { src, dest, series } from "gulp";
import imagemin from "gulp-imagemin";
import plumber from "gulp-plumber";

const imgMin = () =>
  src("app/img/**/*.{png,jpg,svg}")
    .pipe(plumber())
    // .pipe(imagemin())
    .pipe(dest("dist/img"));

export default imgMin;
