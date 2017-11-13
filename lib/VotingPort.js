const uuid = require('uuid/v4')
const { Account } = require('./domain/entities')
const { CreateUserCommand, CreateIssueCommand, TransferCommand } = require('./domain/commands')

module.exports = class VotingPort {
  constructor(eventStore, repository, commandBus) {
    this._eventStore = eventStore
    this._repository = repository
    this._commandBus = commandBus
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
    await this._commandBus.dispatchCommand(new CreateUserCommand({ accountUid }))
  }

  async createIssue(issueIdentifier) {
    const accountUid = this._accountUid(issueIdentifier)
    await this._commandBus.dispatchCommand(new CreateIssueCommand({ accountUid }))
  }

  async creditUser(username, amount) {
    const account = await this._repository.load(Account, this._accountUid(username))
    await account.credit(amount)
  }

  // TODO: This is probably not a domain action
  async creditIssue(issueIdentifier, amount) {
    const account = await this._repository.load(Account, this._accountUid(issueIdentifier))
    await account.credit(amount)
  }

  async vote(username, issueIdentifier, amount) {
    const fromAccountUid = this._accountUid(username)
    const toAccountUid = this._accountUid(issueIdentifier)
    await this._commandBus.dispatchCommand(new TransferCommand({ fromAccountUid, toAccountUid, amount }))
  }

  async getIssueVotes(issueIdentifier) {
    const issueAccount = await this._repository.load(Account, this._accountUid(issueIdentifier))
    return issueAccount._balance
  }

  async getUserVotes(username) {
    const issueAccount = await this._repository.load(Account, this._accountUid(username))
    return issueAccount._balance
  }
}