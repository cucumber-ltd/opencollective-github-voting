const path = require('path')

module.exports = {
  entry: './client/client.js',
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  }
}