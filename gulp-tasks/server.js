import { watch, series } from "gulp";
import pugToHtml from "./pug";
import styles from "./styles";
import script from "./script";
import imgMin from "./img";
import fonts from "./fonts";

const bs = require("browser-sync").create();

const readyReload = (done) => {
  bs.reload();
  done();
};

const server = (done) => {
  bs.init({
    watch: true,
    server: {
      baseDir: "./dist",
      index: "index.html",
    },
  });
  watch("app/js/**/*.js", series(script));
  watch("app/pages/**/*.pug", series(pugToHtml, readyReload));
  watch("app/**/*.{sass,scss}", series(styles, readyReload));
  watch("app/**/*.{png, jpg}", series(imgMin, readyReload));
  watch("app/**/*.svg", series(imgMin, readyReload));
  watch("app/fonts/**/*", series(fonts, readyReload));

  done();
};

export default server;
