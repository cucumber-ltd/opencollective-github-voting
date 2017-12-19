const ValueObject = require('value-object')
const AccountHolder = require('./AccountHolder')

class CreateAccountHolder extends ValueObject.define({
  accountHolderId: 'string'
}) {
  static async process(repository, { accountHolderId, name }) {
    await repository.create(AccountHolder, accountHolderId, { name })
  }
}

class GrantAccountAccess extends ValueObject.define({
  accountHolderId: 'string',
  accountId: 'string',
}) {
  static async process(repository, { accountHolderId, accountId }) {
    const accountHolder = await repository.load(AccountHolder, accountHolderId)
    await accountHolder.grantAccess({ accountId })
  }
}

class LinkAccountHolderToGitHubUser extends ValueObject.define({
  accountHolderId: 'string',
  gitHubUser: 'string',
}) {
  static async process(repository, { accountHolderId, gitHubUser }) {
    const accountHolder = await repository.load(AccountHolder, accountHolderId)
    await accountHolder.linkGitHubUser({ gitHubUser })
  }
}

module.exports = class AccountHolderCommands {
  constructor({ commandBus, accountCommands }) {
    if (!commandBus) throw new Error('No commandBus')
    if (!accountCommands) throw new Error('No accountCommands')
    this._commandBus = commandBus
    this._accountCommands = accountCommands
  }

  async createAccountHolder({ accountHolderId }) {
    if (!accountHolderId) throw new Error('No accountHolderId')
    await this._commandBus.dispatchCommand(new CreateAccountHolder({ accountHolderId }))
  }

  async grantAccountAccess({ accountHolderId, accountId }) {
    await this._commandBus.dispatchCommand(new GrantAccountAccess({ accountHolderId, accountId }))
  }

  async linkAccountHolderToGitHubUser({ accountHolderId, gitHubUser }) {
    await this._commandBus.dispatchCommand(new LinkAccountHolderToGitHubUser({ accountHolderId, gitHubUser }))
  }
}