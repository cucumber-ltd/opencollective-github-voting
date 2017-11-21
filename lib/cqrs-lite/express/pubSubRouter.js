const express = require('express')
const SseStream = require('ssestream')
const uuid = require('uuid/v4')
const asyncExpress = require('./asyncExpress')

module.exports = (pubSub) => {
  const router = express.Router()
  const asyncRouter = asyncExpress(router)
  const sseByConnectionId = new Map()

  router.get('/', (req, res) => {
    const sse = new SseStream(req)
    sse.pipe(res)
    const connectionId = uuid()
    sse.write({ event: 'connectionId', data: connectionId })

    sseByConnectionId.set(connectionId, sse)

    req.on('close', () => {
      sseByConnectionId.delete(connectionId)
      sse.unpipe(res)
      res.end()
    })
  })

  asyncRouter.post('/:connectionId/:subscriberId', async (req, res) => {
    const { connectionId, subscriberId } = req.params
    // We get the subscriptionKey from the body because it may be a "rich" object that cannot be represented as a string
    const subscriptionKey = req.body
    const sse = sseByConnectionId.get(connectionId)
    if (!sse) return res.status(404).end()

    await pubSub.subscribe(subscriptionKey, async () => {
      sse.write({
        event: 'pubsub-notification',
        data: subscriberId
      })
    })

    res.status(201).end()
  })

  return router
}