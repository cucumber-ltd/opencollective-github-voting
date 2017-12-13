const { Readable } = require('stream')
const GitHub = require('github')

module.exports = class GitHubCommitsStream extends Readable {
  constructor({ owner, repo, author, token }) {
    super({ objectMode: true })

    const github = new GitHub()

    github.authenticate({
      type: 'oauth',
      token
    })

    this._resultsPromise = github.repos.getCommits({
      per_page: 100,
      owner,
      repo,
      author
    })
  }

  _read() {
    if (!this._resultsPromise) return null
    this._resultsPromise.then(result => {
      this.push(result)
      if (github.hasNextPage(result)) {
        this._resultsPromise = github.getNextPage(result)
      } else {
        this._resultsPromise = null
      }
    }).catch(err => this.emit('error', err))
  }
}
