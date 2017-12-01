const assert = require('assert')
const PubSub = require('../../../lib/cqrs-lite/pubsub/PubSub')

module.exports = function verifyContract(makeSub) {
  describe('PubSub contract', () => {
    let pub, sub
    beforeEach(async () => {
      const pubSub = new PubSub()
      sub = await makeSub({ sub: pubSub })
      await pubSub.start()
      pub = pubSub
    })

    afterEach(async () => {
      await sub.stop()
    })

    it('defers publishing until flushed', async () => {
      let signalCount = 0
      const subscription = await sub.subscribe('user', async () => {
        signalCount++
      })

      pub.scheduleSignal('user')
      await pub.flushScheduledSignals()
      await pub.flushScheduledSignals()

      await subscription.delivered(1)
      assert.equal(signalCount, 1)
    })

    xit('publishes messages', async () => {
      const subscription = await sub.subscribe('something', async (a, b) => {
        assert.equal(a, 'A')
        assert.equal(b, 'B')
      })

      pub.scheduleSignal('something', 'A', 'B')
      await pub.flushScheduledSignals()

      await subscription.delivered(1)
    })

    it('republishes', async () => {
      let signalCount = 0
      const subscription = await sub.subscribe('user', async () => {
        signalCount++
      })

      pub.scheduleSignal('user')
      await pub.flushScheduledSignals()
      pub.scheduleSignal('user')
      await pub.flushScheduledSignals()

      await subscription.delivered(2)
      assert.equal(signalCount, 2)
    })

    it('publishes to late subscribers', async () => {
      let signalCount = 0
      pub.scheduleSignal('user')

      const subscription = await sub.subscribe('user', async () => {
        signalCount++
      })

      await pub.flushScheduledSignals()

      await subscription.delivered(1)
      assert.equal(signalCount, 1)
    })

    it('publishes to two subscribers', async () => {
      pub.scheduleSignal('sig')

      const sub1 = await sub.subscribe('sig', async () => {
      })
      await pub.flushScheduledSignals(true)
      await sub1.delivered(1)

      const sub2 = await sub.subscribe('sig', async () => {
      })
      await pub.flushScheduledSignals()
      await sub2.delivered(1)
    })
  })
}
