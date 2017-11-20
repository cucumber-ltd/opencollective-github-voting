const {
  CreateAccountCommand,
  CreditAccountCommand,
} = require('./domain/commands')

module.exports = class AccountCommands {
  constructor({commandBus, accountStore}) {
    this._commandBus = commandBus
    this._accountQueries = accountStore
  }

  async createAccount(accountNumber) {
    await this._commandBus.dispatchCommand(new CreateAccountCommand({ accountNumber }))
  }

  async creditAccount(accountNumber, amount) {
    const account = await this._accountQueries.getAccount(accountNumber)
    await this._commandBus.dispatchCommand(new CreditAccountCommand({
      accountUid: account.uid,
      amount
    }))
  }
}