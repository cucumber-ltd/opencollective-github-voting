const SseStream = require('ssestream')
const uuid = require('uuid/v4')
const asyncRouter = require('../express/asyncRouter')

module.exports = (sigSub) => {
  if(!sigSub) throw new Error('No sigSub')
  const router = asyncRouter()
  const sseByConnectionId = new Map()

  router.get('/sigsub', (req, res) => {
    const sse = new SseStream(req)
    sse.pipe(res)
    const connectionId = uuid()
    sse.write({ event: 'sigsub-connectionId', data: connectionId })

    sseByConnectionId.set(connectionId, sse)

    req.on('close', () => {
      sseByConnectionId.delete(connectionId)
      sse.unpipe(res)
      res.end()
    })
  })

  router.$post('/sigsub/:connectionId', async (req, res) => {
    const { connectionId } = req.params
    // We get the subscriptionKey from the body because it may be a "rich" object that cannot be represented as a string
    const subscriptionKey = req.body
    const sse = sseByConnectionId.get(connectionId)
    if (!sse) return res.status(404).end()

    await sigSub.subscribe(subscriptionKey, async () => {
      sse.write({
        event: 'sigsub-signal',
        data: JSON.stringify(subscriptionKey)
      })
    })
    res.status(201).end()
  })

  return router
}