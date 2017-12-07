const Command = require('../infrastructure/cqrs/Command')
const Account = require('../account/Account')

class TransferCommand extends Command {
  static async process(repository, { fromAccountId, toAccountId, amount }) {
    const fromAccount = await repository.load(Account, fromAccountId)
    const toAccount = await repository.load(Account, toAccountId)
    await fromAccount.transfer({ amount, toAccount })
  }
}

module.exports = class TransferCommands {
  constructor({ commandBus }) {
    this._commandBus = commandBus
  }

  async transfer({ fromAccountId, toAccountId, amount }) {
    await this._commandBus.dispatchCommand(new TransferCommand({
      fromAccountId,
      toAccountId,
      amount
    }))
  }
}