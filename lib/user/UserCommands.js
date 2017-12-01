const uuid = require('uuid/v4')
const Command = require('../cqrs-lite/Command')
const User = require('./User')
const Account = require('../account/Account')

class AssignAccountCommand extends Command {
  static async process(repository, { userUid, accountUid }) {
    const account = await repository.load(Account, accountUid)
    await account.assignTo({ userUid })
  }
}

class CreateUserCommand extends Command {
  static async process(repository, { userUid, username }) {
    await repository.create(User, userUid, { username })
  }
}

// TODO: Remove these - they are already defined in UserCommands

class CreateAccountCommand extends Command {
  static async process(repository, { accountUid, accountNumber }) {
    await repository.create(Account, accountUid, { accountNumber })
  }
}

class CreditAccountCommand extends Command {
  static async process(repository, { accountUid, amount, uniqueReference }) {
    const account = await repository.load(Account, accountUid)
    await account.credit({ amount, uniqueReference })
  }
}

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