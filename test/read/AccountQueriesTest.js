const verifyContract = require('./verifyAccountQueriesContract')

describe('AccountQueries', () => {
  verifyContract(async ({ pubSub, accountStore }) => accountStore)
})
