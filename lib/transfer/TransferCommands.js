const ValueObject = require('value-object')
const Account = require('../account/Account')

class TransferCommand extends ValueObject.define({
  fromAccountId: 'string',
  toAccountId: 'string',
  amount: 'number',
}) {
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