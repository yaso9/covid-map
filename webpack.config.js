var path = require("path");

module.exports = {
  mode: "development",
  entry: "./www/scripts/index.js",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: ["url-loader"],
      },
    ],
  },
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
