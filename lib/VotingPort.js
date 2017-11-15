const uuid = require('uuid/v4')
const {
  CreateAccountCommand,
  CreditAccountCommand,
  TransferCommand
} = require('./domain/commands')

module.exports = class VotingPort {
  constructor(commandBus, accountProjection) {
    this._commandBus = commandBus
    this._accountProjection = accountProjection
  }

  async createAccount(accountNumber) {
    const accountUid = uuid()
    await this._commandBus.dispatchCommand(new CreateAccountCommand({ accountUid, accountNumber }))
  }

  async creditAccount(accountNumber, amount) {
    const account = this._accountProjection.getAccount(accountNumber)
    await this._commandBus.dispatchCommand(new CreditAccountCommand({
      accountUid: account.uid,
      amount
    }))
  }

  async transfer(fromAccountNumber, toAccountNumber, amount) {
    const fromAccountUid = this._accountProjection.getAccount(fromAccountNumber).uid
    const toAccountUid = this._accountProjection.getAccount(toAccountNumber).uid
    await this._commandBus.dispatchCommand(new TransferCommand({ fromAccountUid, toAccountUid, amount }))
  }

  async getAccount(accountNumber) {
    return this._accountProjection.getAccount(accountNumber)
  }
}