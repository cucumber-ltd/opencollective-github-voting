const uuid = require('uuid/v4')
const {
  CreateAccountCommand,
  CreditAccountCommand,
} = require('./domain/commands')

module.exports = class AccountCommands {
  constructor({commandBus, accountStore}) {
    this._commandBus = commandBus
    this._accountStore = accountStore
  }

  async createAccount(accountNumber) {
    const accountUid = uuid()
    await this._commandBus.dispatchCommand(new CreateAccountCommand({ accountUid, accountNumber }))
  }

  async creditAccount(accountNumber, amount) {
    const account = await this._accountStore.getAccount(accountNumber)
    await this._commandBus.dispatchCommand(new CreditAccountCommand({
      accountUid: account.uid,
      amount
    }))
  }
}