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

      await pub.publish('sig')
      await pub.flush()
      await pub.flush()

      await subscription.delivered(1)
      assert.equal(signalCount, 1)
    })

    xit('publishes messages', async () => {
      const subscription = await sub.subscribe('something', async (a, b) => {
        assert.equal(a, 'A')
        assert.equal(b, 'B')
      })

      await pub.publish('something', 'A', 'B')
      await pub.flush()

      await subscription.delivered(1)
    })

    xit('republishes', async () => {
      let signalCount = 0
      const subscription = await sub.subscribe('sig', async () => {
        signalCount++
      })

      await pub.publish('sig')
      await pub.flush()
      await pub.publish('sig')
      await pub.flush()

      await subscription.delivered(2)
      assert.equal(signalCount, 2)
    })

    it('publishes to late subscribers', async () => {
      let signalCount = 0
      await pub.publish('sig')

      const subscription = await sub.subscribe('sig', async () => {
        signalCount++
      })

      await pub.flush()

      await subscription.delivered(1)
      assert.equal(signalCount, 1)
    })

    it('publishes to two subscribers', async () => {
      await pub.publish('sig')

      const sub1 = await sub.subscribe('sig', async () => {
      })

      const sub2 = await sub.subscribe('sig', async () => {
      })
      await pub.flush()
      await sub1.delivered(1)
      await sub2.delivered(1)
    })

    it('waits for signal to be scheduled before flushing', async () => {
      process.nextTick(() => {
        pub.publish('sig')
        pub.publish('sig')
      })

      let signalCount = 0
      const subscription = await sub.subscribe('sig', async () => {
        signalCount++
      })
      await pub.published('sig')
      await pub.flush()
      await subscription.delivered(2)
      assert.equal(signalCount, 2)
    })
  })
}
