const Command = require('../infrastructure/cqrs/Command')
const Account = require('./Account')

class CreateAccount extends Command {
  static async process(repository, { accountId, currency }) {
    await repository.create(Account, accountId, { currency })
  }
}

class CreditAccount extends Command {
  static async process(repository, { accountId, amount, uniqueReference }) {
    const account = await repository.load(Account, accountId)
    await account.credit({ amount, uniqueReference })
  }
}

// These commands should be idempotent
module.exports = class AccountCommands {
  constructor({ commandBus, bankQueries }) {
    if (!commandBus) throw new Error('No commandBus')
    if (!bankQueries) throw new Error('No bankQueries')
    this._commandBus = commandBus
    this._bankQueries = bankQueries
  }

  async createAccount({ accountId, currency, initialBalance }) {
    if (!accountId) throw new Error('No accountId')
    if (!currency) throw new Error('No currency')
    if (initialBalance === undefined) throw new Error('No initialBalance')
    await this._commandBus.dispatchCommand(new CreateAccount({ accountId, currency, initialBalance }))
  }

  async creditAccount({ accountId, amount, uniqueReference }) {
    if (!accountId) throw new Error('No accountId')
    if (!amount) throw new Error('No amount')
    if (!uniqueReference) throw new Error('No uniqueReference')
    const account = await this._bankQueries.getAccount(accountId)
    if (!account) throw new Error(`Unknown account ${accountId}`)
    const transaction = account.transactions.find(txn => txn.uniqueReference === uniqueReference)
    if (!transaction) {
      await this._commandBus.dispatchCommand(new CreditAccount({
        accountId,
        amount,
        uniqueReference
      }))
    }
  }
}