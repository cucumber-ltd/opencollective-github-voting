const Command = require('../infrastructure/cqrs/Command')
const Account = require('../account/Account')

class TransferCommand extends Command {
  static async process(repository, { fromAccountUid, toAccountUid, amount }) {
    const fromAccount = await repository.load(Account, fromAccountUid)
    const toAccount = await repository.load(Account, toAccountUid)
    await fromAccount.transfer({ amount, toAccount })
  }
}

module.exports = class TransferCommands {
  constructor({ commandBus, accountQueries }) {
    this._commandBus = commandBus
    this._accountQueries = accountQueries
  }

  async transfer(fromAccountNumber, toAccountNumber, amount) {
    const fromAccountUid = await this._accountQueries.getAccountUidByAccountNumber(fromAccountNumber)
    const toAccountUid = await this._accountQueries.getAccountUidByAccountNumber(toAccountNumber)
    await this._commandBus.dispatchCommand(new TransferCommand({
      fromAccountUid,
      toAccountUid,
      amount
    }))
  }
}