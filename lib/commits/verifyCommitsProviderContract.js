const assert = require('assert')

module.exports = function verifyContract(makeCommitsProvider) {
  describe('CommitsProvider contract', () => {
    let commitsProvider
    beforeEach(async () => {
      commitsProvider = makeCommitsProvider()
    })

    it('has some commits', async () => {
      // We're reading commits from JSON on disk, so we're setting them all to null
      const owner = null, repo = null, author = null, token = null

      const commits = await commitsProvider.getCommits({ owner, repo, author, token })
      assert(commits.length > 0)
      for (const commit of commits) {
        assert(commit.timestamp)
        assert(commit.committer)
      }
    })
  })
}

