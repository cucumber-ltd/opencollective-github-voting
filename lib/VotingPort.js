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

  // TODO: Get from read models later, so it survives reboots
  _accountUid(name) {
    if (!this._accountsByUid.has(name))
      this._accountsByUid.set(name, uuid())
    return this._accountsByUid.get(name)
  }

  async createAccount(accountName) {
    const accountUid = this._accountUid(accountName)
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
    const fromAccountUid = this._accountUid(fromAccountName)
    const toAccountUid = this._accountUid(toAccountName)
    await this._commandBus.dispatchCommand(new TransferCommand({ fromAccountUid, toAccountUid, amount }))
  }

  async getBalance(accountName) {
    const account = this._accountProjection.getAccountByAccountName(accountName)
    return account.balance
  }
}