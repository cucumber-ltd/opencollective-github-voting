const SseStream = require('ssestream')
const uuid = require('uuid/v4')
const asyncRouter = require('../express-extensions/asyncRouter')

module.exports = ({ sub }) => {
  if (!sub) throw new Error('No sub')
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
    // We get the subscriptionKey from the body because it may be a string or object
    const subscriptionKey = req.body
    const sse = sseByConnectionId.get(connectionId)
    if (!sse) return res.status(404).end()

    await sub.subscribe(subscriptionKey, async () => {
      sse.write({
        event: 'sigsub-signal',
        data: JSON.stringify(subscriptionKey)
      })
    })
    res.status(201).end()
  })

  return router
}