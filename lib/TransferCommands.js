const { TransferCommand } = require('./domain/commands')

module.exports = class TransferApi {
  constructor({ commandBus, accountStore }) {
    this._commandBus = commandBus
    this._accountQueries = accountStore
  }

  async transfer(fromAccountNumber, toAccountNumber, amount) {
    const fromAccount = await this._accountQueries.getAccount(fromAccountNumber)
    const toAccount = await this._accountQueries.getAccount(toAccountNumber)
    await this._commandBus.dispatchCommand(new TransferCommand({
      fromAccountUid: fromAccount.uid,
      toAccountUid: toAccount.uid,
      amount
    }))
  }
}