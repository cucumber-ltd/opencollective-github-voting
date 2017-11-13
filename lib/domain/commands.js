const Command = require('../infrastructure/Command')
const { Account } = require('./entities')

class CreateIssueCommand extends Command {
  static async process(repository, { accountUid, issueIdentifier }) {
    await repository.create(Account, accountUid, { accountName: issueIdentifier, accountType: 'issue' })
  }
}

class CreateUserCommand extends Command {
  static async process(repository, { accountUid, username }) {
    await repository.create(Account, accountUid, { accountName: username, accountType: 'user' })
  }
}

class CreditUserCommand extends Command {
  static async process(repository, { accountUid, amount }) {
    const account = await repository.load(Account, accountUid)
    await account.credit(amount)
  }
}

class TransferCommand extends Command {
  static async process(repository, { fromAccountUid, toAccountUid, amount }) {
    const fromAccount = await repository.load(Account, fromAccountUid)
    const toAccount = await repository.load(Account, toAccountUid)
    await fromAccount.transfer(amount, toAccount)
  }
}

module.exports = {
  CreateIssueCommand,
  CreateUserCommand,
  CreditUserCommand,
  TransferCommand
}