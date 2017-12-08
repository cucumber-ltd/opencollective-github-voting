module.exports = {
  entry: './client/client.js',
  output: {
    filename: 'public/client.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  }
}