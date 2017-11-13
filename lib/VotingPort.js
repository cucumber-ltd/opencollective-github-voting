const uuid = require('uuid/v4')
const { Account } = require('./domain/entities')
const {
  CreateUserCommand,
  CreateIssueCommand,
  CreditUserCommand,
  TransferCommand
} = require('./domain/commands')

module.exports = class VotingPort {
  constructor(commandBus, accountProjection) {
    this._commandBus = commandBus
    this._accountProjection = accountProjection
    this._accountsByUid = new Map()
  }

  // TODO: Get from read models later
  _accountUid(name) {
    if (!this._accountsByUid.has(name))
      this._accountsByUid.set(name, uuid())
    return this._accountsByUid.get(name)
  }

  async createUser(username) {
    const accountUid = this._accountUid(username)
    await this._commandBus.dispatchCommand(new CreateUserCommand({ accountUid, username }))
  }

  async createIssue(issueIdentifier) {
    const accountUid = this._accountUid(issueIdentifier)
    await this._commandBus.dispatchCommand(new CreateIssueCommand({ accountUid, issueIdentifier }))
  }

  async creditUser(username, amount) {
    const account = this._accountProjection.getAccountByAccountName(username)
    await this._commandBus.dispatchCommand(new CreditUserCommand({
      accountUid: account.uid,
      amount
    }))
  }

  // TODO: This is probably not a domain action. Merge with creditUser.
  async creditIssue(issueIdentifier, amount) {
    const account = this._accountProjection.getAccountByAccountName(issueIdentifier)
    await this._commandBus.dispatchCommand(new CreditUserCommand({
      accountUid: account.uid,
      amount
    }))
  }

  async vote(username, issueIdentifier, amount) {
    const fromAccountUid = this._accountUid(username)
    const toAccountUid = this._accountUid(issueIdentifier)
    await this._commandBus.dispatchCommand(new TransferCommand({ fromAccountUid, toAccountUid, amount }))
  }

  async getIssueVotes(issueIdentifier) {
    const account = this._accountProjection.getAccountByAccountName(issueIdentifier)
    return account.balance
  }

  async getUserVotes(username) {
    const account = this._accountProjection.getAccountByAccountName(username)
    return account.balance
  }
}