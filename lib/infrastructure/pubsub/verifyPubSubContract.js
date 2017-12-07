const assert = require('assert')
const PubSub = require('./PubSub')

module.exports = function verifyContract(makeSub) {
  describe('PubSub contract', () => {
    let pub, sub
    beforeEach(async () => {
      const pubSub = new PubSub()
      pub = pubSub
      sub = await makeSub({ sub: pubSub })
      await sub.start()
    })

    afterEach(async () => {
      await sub.stop()
    })

    it('defers publishing until flushed', async () => {
      let signalCount = 0
      const subscription = await sub.subscribe('sig', async () => {
        signalCount++
      })

      await pub.scheduleSignal('sig')
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

      await pub.scheduleSignal('something', 'A', 'B')
      await pub.flushScheduledSignals()

      await subscription.delivered(1)
    })

    xit('republishes', async () => {
      let signalCount = 0
      const subscription = await sub.subscribe('sig', async () => {
        signalCount++
      })

      await pub.scheduleSignal('sig')
      await pub.flushScheduledSignals()
      await pub.scheduleSignal('sig')
      await pub.flushScheduledSignals()

      await subscription.delivered(2)
      assert.equal(signalCount, 2)
    })

    it('publishes to late subscribers', async () => {
      let signalCount = 0
      await pub.scheduleSignal('sig')

      const subscription = await sub.subscribe('sig', async () => {
        signalCount++
      })

      await pub.flushScheduledSignals()

      await subscription.delivered(1)
      assert.equal(signalCount, 1)
    })

    it('publishes to two subscribers', async () => {
      await pub.scheduleSignal('sig')

      const sub1 = await sub.subscribe('sig', async () => {
      })

      const sub2 = await sub.subscribe('sig', async () => {
      })
      await pub.flushScheduledSignals()
      await sub1.delivered(1)
      await sub2.delivered(1)
    })

    it('waits for signal to be scheduled before flushing', async () => {
      process.nextTick(() => {
        pub.scheduleSignal('sig')
        pub.scheduleSignal('sig')
      })

      let signalCount = 0
      const subscription = await sub.subscribe('sig', async () => {
        signalCount++
      })
      await pub.scheduled('sig')
      await pub.flushScheduledSignals()
      await subscription.delivered(2)
      assert.equal(signalCount, 2)
    })
  })
}
