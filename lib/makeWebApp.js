const express = require('express')
const bodyParser = require('body-parser')
const subRouter = require('./infrastructure/pubsub/subRouter')
const transferCommandsRouter = require('./transfer/transferCommandsRouter')
const bankQueriesRouter = require('./bank-queries/bankQueriesRouter')

module.exports = ({ sub, transferCommands, bankQueries }) => {
  const app = express()

  app.use(express.static('./public'))
  app.use(bodyParser.json())
  app.use(bodyParser.text())
  app.use(subRouter({ sub }))
  app.use(transferCommandsRouter({ transferCommands }))
  app.use(bankQueriesRouter({ bankQueries }))

  return app
}