const Command = require('../infrastructure/Command')
const { Account } = require('./entities')

class TransferCommand extends Command {
  static async process(repository, { fromAccountUid, toAccountUid, amount }) {
    const fromAccount = await repository.load(Account, fromAccountUid)
    const toAccount = await repository.load(Account, toAccountUid)
    await fromAccount.transfer(amount, toAccount)
  }
}

class CreateUserCommand extends Command {
  static async process(repository, { accountUid }) {
    await repository.create(Account, accountUid)
  }
}

class CreateIssueCommand extends Command {
  static async process(repository, { accountUid }) {
    await repository.create(Account, accountUid)
  }
}

module.exports = {
  CreateUserCommand,
  CreateIssueCommand,
  TransferCommand
}