const uuid = require('uuid/v4')
const {
  AssignAccountCommand,
  CreateAccountCommand,
  CreditAccountCommand,
  CreateUserCommand,
} = require('../domain/commands')

// These commands should be idempotent
module.exports = class AccountCommands {
  constructor({ commandBus, accountQueries }) {
    this._commandBus = commandBus
    this._accountQueries = accountQueries
  }

  async createUser(username) {
    // TODO: return userUid?
    const userUid = uuid()
    await this._commandBus.dispatchCommand(new CreateUserCommand({ userUid, username }))

    // Create and assign accounts for votes and commit-days

    for (const [currency, initialBalance] of [['votes', 10], ['commit-days', 0]]) {
      const number = `${username}-${currency}`
      const accountNumber = { number, currency }
      const accountUid = uuid()

      await this._commandBus.dispatchCommand(new CreateAccountCommand({
        accountUid,
        accountNumber
      }))

      await this._commandBus.dispatchCommand(new AssignAccountCommand({
        accountUid,
        userUid
      }))

      if (initialBalance > 0) {
        await this._commandBus.dispatchCommand(new CreditAccountCommand({
          accountUid,
          amount: initialBalance,
          uniqueReference: uuid()
        }))
      }
    }
  }
}