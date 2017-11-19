/**
 * This class implements the AccountStore query interface
 */
module.exports = class DomAccountList {
  constructor($domNode) {
    this._$domNode = $domNode
  }

  async getAccount(accountNumber) {
    return makeAccount(this._$domNode.querySelector(`[data-account-number="${accountNumber.owner}:${accountNumber.currency}"]`))
  }

  async getAccounts(currency) {
    // We're ignoring the currency argument - just build accounts for everything that's rendered
    return [...this._$domNode.querySelectorAll('[data-type="Account"]')].map(makeAccount)
  }
}

const makeAccount = $account => ({
  accountNumber: {
    owner: $account.querySelector('[aria-label="Owner"]').textContent,
    currency: $account.querySelector('[aria-label="Currency"]').textContent,
  },
  balance: parseInt($account.querySelector('[aria-label="Balance"]').textContent),
  uid: $account.querySelector('[aria-label="Uid"]').textContent,
})
