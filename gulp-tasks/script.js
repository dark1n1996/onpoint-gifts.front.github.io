import { src, dest, series } from "gulp";
import webpack from "webpack-stream";
import plumber from "gulp-plumber";
import uglify from "gulp-uglify";
import babelConfig from "../babel.config.json";

const script = () =>
  src("app/js/*.js")
    .pipe(plumber())
    .pipe(
      webpack({
        entry: {
          index: "./app/js/index.js",
          shop: "./app/js/shop.js",
        },
        output: {
          filename: "[name].js",
          path: `${__dirname}/dist`,
        },
        // devtool: "eval-source-map",
        module: {
          rules: [
            {
              test: /\.js$/,
              loader: "source-map-loader",
            },
            {
              test: /\.(js)$/,
              exclude: /(node_modules)/,
              loader: "babel-loader",
              options: {
                presets: babelConfig.presets,
                plugins: babelConfig.plugins,
              },
            },
            {
              test: /\.json$/,
              loader: "json",
            },
          ],
        },
      })
    )
    .pipe(uglify())
    .pipe(dest("dist/js"));

const snow = () => src("app/js/snow.js").pipe(dest("dist/js"));

export default series(script, snow);
