module.exports = class DomVotingPort {
  constructor(domNode) {
    this._domNode = domNode
  }

  async createAccount(accountNumber) {
    throw new Error('Unsupported Operation')
  }

  async creditAccount(accountNumber, amount) {
    throw new Error('Unsupported Operation')
  }

  async transfer(fromAccountNumber, toAccountNumber, amount) {
    const _toAccountNumber = `${toAccountNumber.owner}:${toAccountNumber.currency}`
    const $toAccount = this._domNode.querySelector(`[data-account-number="${_toAccountNumber}"]`)
    $toAccount.querySelector('[aria-label="Amount"]').value = String(amount)
    $toAccount.querySelector('[aria-label="Transfer"]').click()
  }

  async getAccount(accountNumber) {
    throw new Error('Not me')
  }
}