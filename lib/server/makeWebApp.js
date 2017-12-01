const express = require('express')
const bodyParser = require('body-parser')
const pubSubRouter = require('../cqrs-lite/pubsub/pubSubRouter')
const userCommandsRouter = require('./userCommandsRouter')
const transferCommandsRouter = require('./transferCommandsRouter')
const accountQueriesRouter = require('./accountQueriesRouter')

module.exports = ({ sub, userCommands, transferCommands, accountQueries }) => {
  const app = express()

  app.use(express.static('./public'))
  app.use(bodyParser.json())
  app.use(bodyParser.text())
  app.use(pubSubRouter({ sub }))
  app.use(userCommandsRouter(userCommands))
  app.use(transferCommandsRouter(transferCommands))
  app.use(accountQueriesRouter(accountQueries))

  return app
}