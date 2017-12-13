module.exports = class SimulatingCommitsProvider {
  setCommits(commits) {
    this._commits = commits
  }

  async getCommits({ owner, repo, author, token }) {
    return this._commits
  }
}