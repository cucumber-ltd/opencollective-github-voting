const Command = require('../infrastructure/Command')
const { Account } = require('./entities')

class TransferCommand extends Command {
  static async process(repository, eventStore, { fromAccountUid, toAccountUid, amount }) {
    const fromAccount = await repository.load(Account, fromAccountUid)
    const toAccount = await repository.load(Account, toAccountUid)
    await fromAccount.transfer(amount, toAccount)
  }
}

class CreateUserCommand extends Command {
  static async process(repository, eventStore, { accountUid }) {
    await Account.create(accountUid, eventStore)
  }
}

module.exports = {
  CreateUserCommand,
  TransferCommand
}