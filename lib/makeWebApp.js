const express = require('express')
const bodyParser = require('body-parser')
const subRouter = require('./infrastructure/pubsub/subRouter')
const transferCommandsRouter = require('./transfer/transferCommandsRouter')
const bankQueriesRouter = require('./bank-queries/bankQueriesRouter')
const oauthRouter = require('./oauth/oauthRouter')

module.exports = ({ sub, transferCommands, bankQueries, githubOauthId, githubOauthSecret }) => {
  const app = express()

  if (process.env.NODE_ENV !== 'production') {
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
  app.use(oauthRouter({ githubOauthId, githubOauthSecret }))

  return app
}