const express = require('express')
const bodyParser = require('body-parser')
const subRouter = require('./infrastructure/pubsub/subRouter')
const transferCommandsRouter = require('./transfer/transferCommandsRouter')
const bankQueriesRouter = require('./bank-queries/bankQueriesRouter')
const oauthRouter = require('./oauth/oauthRouter')

module.exports = ({ sub, transferCommands, bankQueries, githubOauthId, githubOauthSecret }) => {
  const app = express()

  app.use(express.static('./public'))
  app.use(bodyParser.json())
  app.use(bodyParser.text())
  app.use(subRouter({ sub }))
  app.use(transferCommandsRouter({ transferCommands }))
  app.use(bankQueriesRouter({ bankQueries }))
  app.use(oauthRouter({ githubOauthId, githubOauthSecret }))

  return app
}