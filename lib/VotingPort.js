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
    this._accountsByUid = new Map()
  }

  async createAccount(accountName) {
    const accountUid = uuid()
    await this._commandBus.dispatchCommand(new CreateAccountCommand({ accountUid, accountName }))
  }

  async creditAccount(accountName, amount) {
    const account = this._accountProjection.getAccountByAccountName(accountName)
    await this._commandBus.dispatchCommand(new CreditAccountCommand({
      accountUid: account.uid,
      amount
    }))
  }

  async transfer(fromAccountName, toAccountName, amount) {
    const fromAccountUid = this._accountProjection.getAccountByAccountName(fromAccountName).uid
    const toAccountUid = this._accountProjection.getAccountByAccountName(toAccountName).uid
    await this._commandBus.dispatchCommand(new TransferCommand({ fromAccountUid, toAccountUid, amount }))
  }

  async getBalance(accountName) {
    const account = this._accountProjection.getAccountByAccountName(accountName)
    return account.balance
  }
}