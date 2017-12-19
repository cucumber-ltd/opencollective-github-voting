const express = require('express')
const bodyParser = require('body-parser')
const subRouter = require('./infrastructure/pubsub/subRouter')
const transferCommandsRouter = require('./transfer/transferCommandsRouter')
const bankQueriesRouter = require('./bank-queries/bankQueriesRouter')
const oauthRouter = require('./oauth/oauthRouter')

module.exports = ({ sub, transferCommands, bankQueries, gitHubOauthId, gitHubOauthSecret }) => {
  const app = express()

  if (process.env.NODE_ENV === 'development') {
    console.log('Using WebPack Dev Middleware')
    const webpackMiddleware = require('./dev/webpackMiddleware')
    app.use(webpackMiddleware())
  }
  app.use(express.static('./public'))
  app.use(bodyParser.json())
  app.use(bodyParser.text())
  app.use(subRouter({ sub }))
  app.use(transferCommandsRouter({ transferCommands }))
  app.use(bankQueriesRouter({ bankQueries }))
  app.use(oauthRouter({ gitHubOauthId, gitHubOauthSecret }))

  return app
}