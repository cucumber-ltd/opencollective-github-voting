const { Given, When } = require('cucumber')

Given('the following commits have been made:', function(commitsTable) {
  const commits = commitsTable.hashes()
  this.simulatedCommitDaysBalanceProvider.setCommits(commits)
})

When('the {accountNumber} balance is updated', async function(accountNumber) {
  const balanceUpdater = this.balanceUpdaters.get(accountNumber.currency)
  await balanceUpdater.updateBalance(accountNumber)
})

// TODO: Refactor
When('the transactions in {fixture} are processed', async function(ocTransactions) {
  await this.openCollectiveImporter.importTransactions(ocTransactions)
})
