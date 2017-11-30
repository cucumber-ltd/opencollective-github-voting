const assert = require('assert')
const SigSub = require('../../../lib/cqrs-lite/sigsub/SigSub')

module.exports = function verifyContract(makeSubscriber) {
  describe('SigSub contract', () => {
    let sigSub, subscriber
    beforeEach(async () => {
      sigSub = new SigSub()
      subscriber = await makeSubscriber(sigSub)
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

      sigSub.scheduleSignal('user')
      await sigSub.flushScheduledSignals()
      await sigSub.flushScheduledSignals()

      await subscription.delivered(1)
      assert.equal(signalCount, 1)
    })

    xit('publishes messages', async () => {
      const subscription = await subscriber.subscribe('something', async (a, b) => {
        assert.equal(a, 'A')
        assert.equal(b, 'B')
      })

      sigSub.scheduleSignal('something', 'A', 'B')
      await sigSub.flushScheduledSignals()

      await subscription.delivered(1)
    })

    it('republishes', async () => {
      let signalCount = 0
      const subscription = await subscriber.subscribe('user', async () => {
        signalCount++
      })

      sigSub.scheduleSignal('user')
      await sigSub.flushScheduledSignals()
      sigSub.scheduleSignal('user')
      await sigSub.flushScheduledSignals()

      await subscription.delivered(2)
      assert.equal(signalCount, 2)
    })

    it('publishes to late subscribers', async () => {
      let signalCount = 0
      sigSub.scheduleSignal('user')

      const subscription = await subscriber.subscribe('user', async () => {
        signalCount++
      })

      await sigSub.flushScheduledSignals()

      await subscription.delivered(1)
      assert.equal(signalCount, 1)
    })

    it('publishes to two subscribers', async () => {
      sigSub.scheduleSignal('sig')

      const sub1 = await subscriber.subscribe('sig', async () => {})
      await sigSub.flushScheduledSignals(true)
      await sub1.delivered(1)

      const sub2 = await subscriber.subscribe('sig', async () => {})
      await sigSub.flushScheduledSignals()
      await sub2.delivered(1)
    })
  })
}
