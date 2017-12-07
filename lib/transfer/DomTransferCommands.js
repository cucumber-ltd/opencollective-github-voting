const assert = require('assert')

module.exports = class DomTransferCommands {
  constructor({ $domNode }) {
    if (!$domNode) throw new Error('No $domNode')
    this._$domNode = $domNode
  }

  async transfer({ fromAccountId, toAccountId, amount }) {
    // Simply assert that we've rendered our own "from" account
    const $fromAccount = this._$domNode.querySelector(`[data-account-id="${fromAccountId}"]`)
    // TODO
    //assert($fromAccount)

    const $toAccount = this._$domNode.querySelector(`[data-account-id="${toAccountId}"]`)
    const $amount = $toAccount.querySelector('[aria-label="Transfer Amount"]')
    $amount.value = String(amount)

    // Trigger change event
    const e = document.createEvent('UIEvents')
    e.initEvent('change', true, true)
    $amount.dispatchEvent(e)

    $toAccount.querySelector('[aria-label="Transfer"]').click()
  }
}
