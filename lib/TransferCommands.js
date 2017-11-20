const { TransferCommand } = require('./domain/commands')

module.exports = class TransferApi {
  constructor({ commandBus, accountStore }) {
    this._commandBus = commandBus
    this._accountStore = accountStore
  }

  async transfer(fromAccountNumber, toAccountNumber, amount) {
    const fromAccount = await this._accountStore.getAccount(fromAccountNumber)
    const toAccount = await this._accountStore.getAccount(toAccountNumber)
    await this._commandBus.dispatchCommand(new TransferCommand({
      fromAccountUid: fromAccount.uid,
      toAccountUid: toAccount.uid,
      amount
    }))
  }
}