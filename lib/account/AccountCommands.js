const uuid = require('uuid/v4')
const {
  CreateAccountCommand,
  CreditAccountCommand,
} = require('../domain/commands')

// These commands are idempotent
module.exports = class AccountCommands {
  constructor({ commandBus, accountQueries }) {
    this._commandBus = commandBus
    this._accountQueries = accountQueries
  }

  async createAccount(accountNumber) {
    const account = await this._accountQueries.getAccount(accountNumber)
    if (!account) {
      const accountUid = uuid()
      await this._commandBus.dispatchCommand(new CreateAccountCommand({ accountUid, accountNumber }))
    }
  }

  async creditAccount(accountNumber, amount, uniqueReference) {
    if (!uniqueReference) throw new Error('Missing uniqueReference')
    const account = await this._accountQueries.getAccount(accountNumber)
    if (!account) throw new Error(`Unknown account ${JSON.stringify(accountNumber)}`)
    const transaction = account.transactions.find(txn => txn.uniqueReference === uniqueReference)
    if (!transaction) {
      const accountUid = await this._accountQueries.getAccountUidByAccountNumber(accountNumber)
      await this._commandBus.dispatchCommand(new CreditAccountCommand({
        accountUid,
        amount,
        uniqueReference
      }))
    }
  }
}