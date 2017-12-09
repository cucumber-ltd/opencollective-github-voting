module.exports = class SimulatingCommitsProvider {
  setCommits(commits) {
    this._commits = commits
  }

  getCommits() {
    return this._commits
  }
}