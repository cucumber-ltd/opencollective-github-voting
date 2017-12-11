const SimulatorCommitsProvider = require('./SimulatorCommitsProvider')
const verifyContract = require('./verifyCommitsProviderContract')

describe('SimulatorCommitsProvider', () => {
  verifyContract(() => {
    const commitsProvider = new SimulatorCommitsProvider()
    commitsProvider.setCommits([
      { committer: 'testcommitter', timestamp: '2017-11-08' }
    ])
    return commitsProvider
  })
})
