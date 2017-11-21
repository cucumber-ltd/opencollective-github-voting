const express = require('express')
const bodyParser = require('body-parser')
const pubsubRouter = require('../cqrs-lite/express/pubSubRouter')
const transferCommandsRouter = require('./transferCommandsRouter')
const accountQueriesRouter = require('./accountQueriesRouter')

module.exports = ({ transferCommands, accountQueries }) => {
  const app = express()
  app.use(express.static('./public'))
  app.use(bodyParser.json())
  app.use('/pubsub', pubsubRouter(accountQueries))
  app.use('/transfers', transferCommandsRouter(transferCommands))
  app.use('/accounts', accountQueriesRouter(accountQueries))
  return app
}