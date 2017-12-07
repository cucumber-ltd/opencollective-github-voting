const express = require('express')
const bodyParser = require('body-parser')
const pubSubRouter = require('./infrastructure/pubsub/pubSubRouter')
const transferCommandsRouter = require('./transfer/transferCommandsRouter')
const bankQueriesRouter = require('./bank-queries/bankQueriesRouter')

module.exports = ({ sub, transferCommands, bankQueries }) => {
  const app = express()

  app.use(express.static('./public'))
  app.use(bodyParser.json())
  app.use(bodyParser.text())
  app.use(pubSubRouter({ sub }))
  app.use(transferCommandsRouter(transferCommands))
  app.use(bankQueriesRouter(bankQueries))

  return app
}