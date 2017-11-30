const verifyPubSubContract = require('./verifyPubSubContract')

describe('PubSub', () => {
  verifyPubSubContract(pubSub => pubSub)
})