const uuid = require('uuid/v4')
const {
  CreateAccountCommand,
  CreditAccountCommand,
  TransferCommand
} = require('./domain/commands')

module.exports = class VotingPort {
  constructor(commandBus, accountProjector) {
    this._commandBus = commandBus
    this._accountProjector = accountProjector
    this._accountsByUid = new Map()
  }

  async createAccount(accountName) {
    const accountUid = uuid()
    await this._commandBus.dispatchCommand(new CreateAccountCommand({ accountUid, accountName }))
  }

  async creditAccount(accountName, amount) {
    const account = this._accountProjector.getAccountByAccountName(accountName)
    await this._commandBus.dispatchCommand(new CreditAccountCommand({
      accountUid: account.uid,
      amount
    }))
  }

  async transfer(fromAccountName, toAccountName, amount) {
    const fromAccountUid = this._accountProjector.getAccountByAccountName(fromAccountName).uid
    const toAccountUid = this._accountProjector.getAccountByAccountName(toAccountName).uid
    await this._commandBus.dispatchCommand(new TransferCommand({ fromAccountUid, toAccountUid, amount }))
  }

  async getAccount(accountName) {
    return this._accountProjector.getAccountByAccountName(accountName)
  }
}