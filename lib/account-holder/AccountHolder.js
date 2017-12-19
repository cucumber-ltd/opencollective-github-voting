const Entity = require('../infrastructure/cqrs/Entity')
const Event = require('../infrastructure/cqrs/Event')

module.exports = class Account extends Entity {
  async create({}) {
    await this.trigger(AccountHolderCreated, {})
  }

  async grantAccess({ accountId }) {
    await this.trigger(AccountAccessGranted, { accountId })
  }

  async linkGitHubUser({ gitHubUser }) {
    await this.trigger(GitHubUserLinked, { gitHubUser })
  }
}

class AccountHolderEvent extends Event {
  get accountId() {
    return this.entityUid
  }
}

class AccountHolderCreated extends AccountHolderEvent {
}
AccountHolderCreated.properties = {}

class AccountAccessGranted extends AccountHolderEvent {
}
AccountAccessGranted.properties = { accountId: 'string' }

class GitHubUserLinked extends AccountHolderEvent {
}
GitHubUserLinked.properties = { gitHubUser: 'string' }
