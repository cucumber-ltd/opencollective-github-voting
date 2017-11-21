const verifyContract = require('./verifyAccountQueriesContract')

describe('AccountQueries', () => {
  verifyContract(async accountQueries => accountQueries)
})
