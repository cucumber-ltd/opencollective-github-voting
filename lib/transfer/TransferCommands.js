const { TransferCommand } = require('../domain/commands')

module.exports = class TransferCommands {
  constructor({ commandBus, accountQueries }) {
    this._commandBus = commandBus
    this._accountQueries = accountQueries
  }

  async transfer(fromAccountNumber, toAccountNumber, amount) {
    const fromAccountUid = await this._accountQueries.getAccountUidByAccountNumber(fromAccountNumber)
    const toAccountUid = await this._accountQueries.getAccountUidByAccountNumber(toAccountNumber)
    await this._commandBus.dispatchCommand(new TransferCommand({
      fromAccountUid,
      toAccountUid,
      amount
    }))
  }
}