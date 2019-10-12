const merge = require("webpack-merge");
const common = require("./webpack.common.js");
module.exports = merge(common, {
  mode: "development",
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  devServer: {
    contentBase: false,
    historyApiFallback: true,
    proxy: [
      {
        context: [
          "/users",
          "/games",
          "/players",
          "/steps",
          "/authentication",
          "/socket.io"
        ],
        target: "http://localhost:3030",
        secure: false,
        ws: true
      }
    ]
  }
});
