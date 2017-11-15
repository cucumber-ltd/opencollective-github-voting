const Command = require('../cqrs-lite/Command')
const Account = require('./entities/Account')

class CreateAccountCommand extends Command {
  static async process(repository, { accountUid, accountNumber }) {
    await repository.create(Account, accountUid, { accountNumber })
  }
}

class CreditAccountCommand extends Command {
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
  CreateAccountCommand,
  CreditAccountCommand,
  TransferCommand
}