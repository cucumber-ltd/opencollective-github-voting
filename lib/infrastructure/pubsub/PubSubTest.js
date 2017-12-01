const verifyPubSubContract = require('./verifyPubSubContract')

describe('PubSub', () => {
  verifyPubSubContract(({ sub }) => sub)
})