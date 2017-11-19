const uuid = require('uuid/v4')
const {
  CreateAccountCommand,
  CreditAccountCommand,
  TransferCommand
} = require('./domain/commands')

module.exports = class VotingPort {
  constructor({commandBus, accountStore}) {
    this._commandBus = commandBus
    this._accountStore = accountStore
  }

  async createAccount(accountNumber) {
    const accountUid = uuid()
    await this._commandBus.dispatchCommand(new CreateAccountCommand({ accountUid, accountNumber }))
  }

  async creditAccount(accountNumber, amount) {
    const account = await this._accountStore.getAccount(accountNumber)
    await this._commandBus.dispatchCommand(new CreditAccountCommand({
      accountUid: account.uid,
      amount
    }))
  }

  async transfer(fromAccountNumber, toAccountNumber, amount) {
    const fromAccount = await this._accountStore.getAccount(fromAccountNumber)
    const toAccount = await this._accountStore.getAccount(toAccountNumber)
    await this._commandBus.dispatchCommand(new TransferCommand({
      fromAccountUid: fromAccount.uid,
      toAccountUid: toAccount.uid,
      amount
    }))
  }
}