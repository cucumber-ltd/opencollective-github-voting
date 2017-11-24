const assert = require('assert')

module.exports = class DomTransferCommands {
  constructor($domNode) {
    this._$domNode = $domNode
  }

  async transfer(fromAccountNumber, toAccountNumber, amount) {
    assert.equal(this._$domNode.querySelector('[aria-label=MyAccountOwner]').textContent, fromAccountNumber.number)
    assert.equal(this._$domNode.querySelector('[aria-label=MyAccountCurrency]').textContent, fromAccountNumber.currency)

    const toAccountNumberKey = `${toAccountNumber.number}:${toAccountNumber.currency}`
    const $toAccount = this._$domNode.querySelector(`[data-account-number="${toAccountNumberKey}"]`)
    const $amount = $toAccount.querySelector('[aria-label="TransferAmount"]')
    $amount.value = String(amount)

    // Trigger change event
    const e = document.createEvent('UIEvents')
    e.initEvent('change', true, true)
    $amount.dispatchEvent(e)

    $toAccount.querySelector('[aria-label="Transfer"]').click()

    // Synchronise. This won't work as soon as we have true asynchronicity (I/O - HTTP)
    await new Promise(resolve => process.nextTick(resolve))
  }
}
