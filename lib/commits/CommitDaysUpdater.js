const uuid = require('uuid/v4')

/**
 * Credits accounts with currency "commit-days"
 *
 * @type {module.CommitDaysUpdater}
 */
module.exports = class CommitDaysUpdater {
  constructor({ commitsProvider, bankQueries, accountCommands }) {
    this._commitsProvider = commitsProvider
    this._bankQueries = bankQueries
    this._accountCommands = accountCommands
  }

  async importCommits({ owner, repo, author, token }) {
    const commits = await this._commitsProvider.getCommits({ owner, repo, author, token })
    const commitDaysByCommitter = new Map()
    for (const commit of commits) {
      if (!commitDaysByCommitter.has(commit.committer)) commitDaysByCommitter.set(commit.committer, new Set())
      const day = new Date(Date.parse(commit.timestamp)).setHours(0, 0, 0, 0)
      commitDaysByCommitter.get(commit.committer).add(day)
    }

    for (const [committer, commitDays] of commitDaysByCommitter) {
      const accountHolder = await this._bankQueries.getAccountHolderByName(committer)
      if (accountHolder) {
        const account = accountHolder.accounts.find(account => account.currency = 'commit-days')

        if (account) {
          const accountId = account.id
          const amount = commitDays.size
          const uniqueReference = uuid()

          this._accountCommands.creditAccount({ accountId, amount, uniqueReference })
        }
      }
    }
  }
}