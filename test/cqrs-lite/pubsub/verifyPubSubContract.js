const assert = require('assert')
const PubSub = require('../../../lib/cqrs-lite/pubsub/PubSub')

module.exports = function verifyContract(makeSubscriber) {
  describe('PubSub contract', () => {
    let pubSub, subscriber
    beforeEach(async () => {
      pubSub = new PubSub()
      subscriber = await makeSubscriber(pubSub)
      await subscriber.start()
    })

    afterEach(async () => {
      await subscriber.stop()
    })

    it('defers publishing until flushed', async () => {
      let signalCount = 0
      const subscription = await subscriber.subscribe('user', async () => {
        signalCount++
      })

      pubSub.scheduleSignal('user')
      await pubSub.flushScheduledSignals()
      await pubSub.flushScheduledSignals()

      await subscription.delivered(1)
      assert.equal(signalCount, 1)
    })

    xit('publishes messages', async () => {
      const subscription = await subscriber.subscribe('something', async (a, b) => {
        assert.equal(a, 'A')
        assert.equal(b, 'B')
      })

      pubSub.scheduleSignal('something', 'A', 'B')
      await pubSub.flushScheduledSignals()

      await subscription.delivered(1)
    })

    it('republishes', async () => {
      let signalCount = 0
      const subscription = await subscriber.subscribe('user', async () => {
        signalCount++
      })

      pubSub.scheduleSignal('user')
      await pubSub.flushScheduledSignals()
      pubSub.scheduleSignal('user')
      await pubSub.flushScheduledSignals()

      await subscription.delivered(2)
      assert.equal(signalCount, 2)
    })

    it('publishes to late subscribers', async () => {
      let signalCount = 0
      pubSub.scheduleSignal('user')

      const subscription = await subscriber.subscribe('user', async () => {
        signalCount++
      })

      await pubSub.flushScheduledSignals()

      await subscription.delivered(1)
      assert.equal(signalCount, 1)
    })

    it('publishes to two subscribers', async () => {
      pubSub.scheduleSignal('sig')

      const sub1 = await subscriber.subscribe('sig', async () => {})
      await pubSub.flushScheduledSignals(true)
      await sub1.delivered(1)

      const sub2 = await subscriber.subscribe('sig', async () => {})
      await pubSub.flushScheduledSignals()
      await sub2.delivered(1)
    })
  })
}
