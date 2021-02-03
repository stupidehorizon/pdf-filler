const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const DIST_PATH = path.join(__dirname, '..', '..', 'dist');

module.exports = {
  entry: {
    render: path.join(__dirname, 'render', 'index.js'),
    edit: path.join(__dirname, 'edit', 'index.js'),
  },
  output: {
    filename: `[name]/index.js`,
    path: DIST_PATH,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        }
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                strictMath: true,
                "javascriptEnabled": true,
              },
            },
          },
        ]
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, 'render', 'index.html'), to: path.join(DIST_PATH, 'render')},
        { from: path.join(__dirname, 'edit','index.html'), to: path.join(DIST_PATH, 'edit') },
        { from: path.join(__dirname, '..', '..', 'template'), to: DIST_PATH },
        { from: path.join(__dirname, '..', '..', 'static'), to: path.join(DIST_PATH, 'static') },
      ],
    }),
  ],
  devServer: {
    contentBase: DIST_PATH,
    compress: true,
    port: 3000
  }
};