module.exports = class SimulatedCommitsBalanceProvider {
  setCommits(commits) {
    this._commits = commits
  }

  async getBalance() {
    return this._commits.reduce((balance, commit) => {
      console.log(commit)
      return balance + 1
    }, 0)
  }
}