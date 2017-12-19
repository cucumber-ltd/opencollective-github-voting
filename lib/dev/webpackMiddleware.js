const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('../../webpack.config')
const compiler = webpack(webpackConfig)

module.exports = () => {
  return webpackDevMiddleware(compiler, {
    logLevel: 'trace',
    lazy: true,
    publicPath: webpackConfig.output.publicPath
  })
}
