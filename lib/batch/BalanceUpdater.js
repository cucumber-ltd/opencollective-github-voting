module.exports = class BalanceUpdater {

  constructor({ accountCommands, balanceProvider }) {
    this._accountCommands = accountCommands
    this._balanceProvider = balanceProvider
  }

  async updateBalance(accountNumber) {
    const balance = await this._balanceProvider.getBalance()
    const amount = balance
    const uniqueReference = 'some-import'
    await this._accountCommands.creditAccount(accountNumber, amount, uniqueReference)
  }
}