const Command = require('../cqrs-lite/Command')
const Account = require('./entities/Account')
const User = require('./entities/User')

class AssignAccountCommand extends Command {
  static async process(repository, { accountUid, userUid }) {
    const account = await repository.load(Account, accountUid)
    await account.assignTo({ userUid })
  }
}

class CreateAccountCommand extends Command {
  static async process(repository, { accountUid, accountNumber }) {
    await repository.create(Account, accountUid, { accountNumber })
  }
}

class CreateUserCommand extends Command {
  static async process(repository, { userUid, username }) {
    await repository.create(User, userUid, { username })
  }
}

class CreditAccountCommand extends Command {
  static async process(repository, { accountUid, amount, uniqueReference }) {
    const account = await repository.load(Account, accountUid)
    await account.credit({ amount, uniqueReference })
  }
}

class TransferCommand extends Command {
  static async process(repository, { fromAccountUid, toAccountUid, amount }) {
    const fromAccount = await repository.load(Account, fromAccountUid)
    const toAccount = await repository.load(Account, toAccountUid)
    await fromAccount.transfer({ amount, toAccount })
  }
}

module.exports = {
  AssignAccountCommand,
  CreateAccountCommand,
  CreateUserCommand,
  CreditAccountCommand,
  TransferCommand
}