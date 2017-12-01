const assert = require('assert')

module.exports = class DomUserCommands {
  constructor({ $domNode }) {
    if (!$domNode) throw new Error('No $domNode')
    this._$domNode = $domNode
  }

  async createUser(username) {
    assert.equal(this._$domNode.querySelector('[aria-label=MyUsername]').textContent, username)

    const $createUserButton = this._$domNode.querySelector(`[aria-label="Create User"]`)
    $createUserButton.click()

    // Synchronise. This won't work as soon as we have true asynchronicity (I/O - HTTP)
    await new Promise(resolve => process.nextTick(resolve))
  }
}
