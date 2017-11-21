module.exports = class OpenCollectiveImporter {
  constructor({ accountCommands }) {
    this._accountCommands = accountCommands
  }

  async importTransactions(ocTransactions) {
    for (const ocTransaction of ocTransactions) {
      const accountNumber = {
        owner: `opencollective-user-${ocTransaction.CreatedByUserId}`,
        currency: ocTransaction.currency.toUpperCase()
      }
      await this._accountCommands.createAccount(accountNumber)
      const uniqueReference = ocTransaction.uuid
      const amount = ocTransaction.amount / 100
      if (ocTransaction.type === 'CREDIT') {
        await this._accountCommands.creditAccount(accountNumber, amount, uniqueReference)
      }
    }
  }
}