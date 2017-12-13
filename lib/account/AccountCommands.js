const ValueObject = require('value-object')
const Account = require('./Account')

class CreateAccount extends ValueObject.define({
  accountId: 'string',
  currency: 'string',
  initialBalance: 'number',
}) {
  static async process(repository, { accountId, currency, initialBalance }) {
    await repository.create(Account, accountId, { currency, initialBalance })
  }
}

class CreditAccount extends ValueObject.define({
  accountId: 'string',
  amount: 'number',
  uniqueReference: 'string',
}) {
  static async process(repository, { accountId, amount, uniqueReference }) {
    const account = await repository.load(Account, accountId)
    await account.credit({ amount, uniqueReference })
  }
}

module.exports = class AccountCommands {
  constructor({ commandBus, bankQueries }) {
    this._commandBus = commandBus
    this._bankQueries = bankQueries
  }

  async createAccount({ accountId, currency, initialBalance }) {
    await this._commandBus.dispatchCommand(new CreateAccount({ accountId, currency, initialBalance }))
  }

  // This command is idempotent
  async creditAccount({ accountId, amount, uniqueReference }) {
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