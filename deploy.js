const vfs = require("vinyl-fs");
const ftp = require("vinyl-ftp");
const https = require("https");
const conn = new ftp({
  host: "onpoint.ru",
  user: "gunmax",
  password: "hTX3FK3R",
  parallel: 1,
  log: ftpLog(),
});

function ftpLog() {
  let progressSymbols = ["|", "/", "-", "\\", "|", "/", "-", "\\"];
  let currProgress = 0;
  let lastState = "";
  try {
    return function (state, progress) {
      if (currProgress === progressSymbols.length - 1) {
        currProgress = 0;
      } else {
        currProgress = currProgress + 1;
      }
      if (state.indexOf("UP") !== -1 && lastState.indexOf("UP") !== -1) {
        process.stdout.write("\r\x1b[K");
        process.stdout.write(
          progressSymbols[currProgress] + "::" + state + "::" + (progress || "")
        );
      } else {
        process.stdout.write(
          "\n" +
            progressSymbols[currProgress] +
            "::" +
            state +
            "::" +
            (progress || "")
        );
      }
      lastState = state;
    };
  } catch (e) {
    console.log(e);
  }
}

// const GOOGLE_SITEMAP_UPDATE = 'https://google.com/ping?sitemap=http://www.onpoint.ru/sitemap.xml'
// const BING_SITEMAP_UPDATE = 'https://www.bing.com/ping?sitemap=http://www.onpoint.ru/sitemap.xml'
// const sitemapUploadURLs = [
//   GOOGLE_SITEMAP_UPDATE,
//   BING_SITEMAP_UPDATE
// ]

vfs.src(["./dist/**"], { buffer: false }).pipe(conn.dest("/ny/public_html"));
