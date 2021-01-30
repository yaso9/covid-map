var path = require("path");

module.exports = {
  mode: "development",
  entry: "./www/scripts/index.js",
  output: {
    path: path.resolve(__dirname, "www/dist"),
    filename: "bundle.js",
  },
  devServer: {
    contentBase: "./www",
    writeToDisk: true,
    watchContentBase: true,
  },
};
