module.exports = class SimulatingCommitsProvider {
  setCommits(commits) {
    this._commits = commits
  }

  async getCommits() {
    return this._commits
  }
}