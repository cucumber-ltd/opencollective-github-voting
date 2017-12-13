const ValueObject = require('value-object')
const AccountHolder = require('./AccountHolder')

class CreateAccountHolder extends ValueObject.define({
  accountHolderId: 'string',
  name: 'string',
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

module.exports = class AccountHolderCommands {
  constructor({ commandBus, accountCommands }) {
    if (!commandBus) throw new Error('No commandBus')
    if (!accountCommands) throw new Error('No accountCommands')
    this._commandBus = commandBus
    this._accountCommands = accountCommands
  }

  async createAccountHolder({ accountHolderId, name }) {
    if (!accountHolderId) throw new Error('No accountHolderId')
    if (!name) throw new Error('No name')
    await this._commandBus.dispatchCommand(new CreateAccountHolder({ accountHolderId, name }))
  }

  async grantAccountAccess({ accountHolderId, accountId }) {
    await this._commandBus.dispatchCommand(new GrantAccountAccess({ accountHolderId, accountId }))
  }
}