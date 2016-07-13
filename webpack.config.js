var path = require('path');

module.exports = {
  entry: "./src/app/app.js",
  output: {
    filename: "public/js/bundle.js",
    sourceMapFilename: "public/js/bundle.map"
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  },
  devtool: '#source-map'
};
