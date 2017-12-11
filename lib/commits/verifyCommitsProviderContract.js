const assert = require('assert')

module.exports = function verifyContract(makeCommitsProvider) {
  describe('CommitsProvider contract', () => {
    let commitsProvider
    beforeEach(async () => {
      commitsProvider = makeCommitsProvider()
    })

    it('has some commits', async () => {
      const commits = await commitsProvider.getCommits()
      assert(commits.length > 0)
      for (const commit of commits) {
        assert(commit.timestamp)
        assert(commit.committer)
      }
    })
  })
}

