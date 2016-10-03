// webpack.config.js
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: "./entry.js",
  output: {
    path: './public',
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=react,presets[]=es2015']
      }
    ]
  },
  plugins: [new Dotenv()]
};
