const { Writable } = require('stream')

module.exports = class GitHubCommitsProvider {
  constructor(getGitHubCommitsStream) {
    this._getGitHubCommitsStream = getGitHubCommitsStream
  }

  async getCommits({ owner, repo, author, token }) {
    return new Promise((resolve, reject) => {
      const commits = []
      const stream = this._getGitHubCommitsStream(({ owner, repo, author, token })).pipe(new Writable({
        objectMode: true,
        write(json, _, cb) {
          const ghEvent = JSON.parse(json)
          for (const ghCommit of ghEvent.data) {
            const commit = {
              committer: ghCommit.committer.login,
              timestamp: ghCommit.commit.author.date
            }
            commits.push(commit)
          }
          cb()
        }
      }))
      stream.on('error', reject)
      stream.on('finish', () => resolve(commits))
    })
  }
}