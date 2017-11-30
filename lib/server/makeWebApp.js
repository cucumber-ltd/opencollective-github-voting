const express = require('express')
const bodyParser = require('body-parser')
const sigSubRouter = require('../cqrs-lite/sigsub/sigSubRouter')
const userCommandsRouter = require('./userCommandsRouter')
const transferCommandsRouter = require('./transferCommandsRouter')
const accountQueriesRouter = require('./accountQueriesRouter')

module.exports = ({ sigSub, userCommands, transferCommands, accountQueries }) => {
  const app = express()

  app.use(express.static('./public'))
  app.use(bodyParser.json())
  app.use(sigSubRouter(sigSub))
  app.use(userCommandsRouter(userCommands))
  app.use(transferCommandsRouter(transferCommands))
  app.use(accountQueriesRouter(accountQueries))

  return app
}