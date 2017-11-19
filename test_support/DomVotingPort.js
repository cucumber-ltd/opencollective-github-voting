const assert = require('assert')

/**
 * This class implements the VotingPort command interface
 */
module.exports = class DomVotingPort {
  constructor($domNode) {
    this._$domNode = $domNode
  }

  // TODO: Rename to DomTransferApi (one contract per method)
  async createAccount(accountNumber) {
    throw new Error('Unsupported Operation')
  }

  async creditAccount(accountNumber, amount) {
    throw new Error('Unsupported Operation')
  }

  async transfer(fromAccountNumber, toAccountNumber, amount) {
    assert.equal(this._$domNode.querySelector('[aria-label=MyAccountOwner]').textContent, fromAccountNumber.owner)
    assert.equal(this._$domNode.querySelector('[aria-label=MyAccountCurrency]').textContent, fromAccountNumber.currency)

    const toAccountNumberKey = `${toAccountNumber.owner}:${toAccountNumber.currency}`
    const $toAccount = this._$domNode.querySelector(`[data-account-number="${toAccountNumberKey}"]`)
    $toAccount.querySelector('[aria-label="TransferAmount"]').value = String(amount)
    $toAccount.querySelector('[aria-label="Transfer"]').click()
  }
}
