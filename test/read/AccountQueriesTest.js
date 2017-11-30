const verifyContract = require('./verifyAccountQueriesContract')

describe('AccountQueries', () => {
  verifyContract(async ({ sigSub, accountStore }) => accountStore)
})
