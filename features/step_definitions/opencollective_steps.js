const { When } = require('cucumber')

When('the transactions in {fixture} are processed', async function(ocTransactions) {
  await this.openCollectiveImporter.importTransactions(ocTransactions)
})