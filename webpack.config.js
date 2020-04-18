const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const nodeEnv = process.env.NODE_ENV || "development";

module.exports = {
  entry: ["./frontend/index.js"],
  mode: nodeEnv,
  devtool: nodeEnv === "development" ? "source-map" : "none",
  output:
    nodeEnv === "production"
      ? {
          path: path.resolve(__dirname, "./priv/static/assets"),
          filename: "./index.js",
          publicPath: "/assets/",
        }
      : {
          path: path.resolve(__dirname, "./priv/static/assets"),
          filename: "./index.js",
          publicPath: "http://localhost:8000/assets/",
        },
  resolve: {
    alias: {
      root: path.resolve(__dirname, "./frontend/"),
      "react-dom": "@hot-loader/react-dom",
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(jpg|png|mp3)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 25000,
          },
        },
      },
    ],
  },
  plugins: [new CopyWebpackPlugin([{ from: "frontend/static/", to: "../" }])],
  devServer: {
    publicPath: "/assets/",
    historyApiFallback: true,
    host: "0.0.0.0",
    port: 8000,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    writeToDisk: (filePath) => {
      return /(favicon\.ico|robots.txt)$/.test(filePath);
    },
    /* eslint-disable */
    before: function (app, webpackServer) {
      // We override the listen() function to set keepAliveTimeout.
      // See: https://github.com/microsoft/WSL/issues/4340
      // Original listen(): https://github.com/webpack/webpack-dev-server/blob/f80e2ae101e25985f0d7e3e9af36c307bfc163d2/lib/Server.js#L744
      const { listen } = webpackServer;
      webpackServer.listen = function (...args) {
        const server = listen.call(this, ...args);
        server.keepAliveTimeout = 0;
        return server;
      };
    },
    /* eslint-enable */
  },
};
