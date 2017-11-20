const {
  CreateAccountCommand,
  CreditAccountCommand,
} = require('./domain/commands')

module.exports = class AccountCommands {
  constructor({ commandBus, accountQueries }) {
    this._commandBus = commandBus
    this._accountQueries = accountQueries
  }

  async createAccount(accountNumber) {
    await this._commandBus.dispatchCommand(new CreateAccountCommand({ accountNumber }))
  }

  async creditAccount(accountNumber, amount) {
    const accountUid = await this._accountQueries.getAccountUidByAccountNumber(accountNumber)
    await this._commandBus.dispatchCommand(new CreditAccountCommand({
      accountUid,
      amount
    }))
  }
}