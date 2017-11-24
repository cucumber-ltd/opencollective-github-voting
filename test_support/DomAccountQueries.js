module.exports = class DomAccountQueries {
  constructor($domNode) {
    this._$domNode = $domNode
  }

  async getAccount(accountNumber) {
    return makeAccount(this._$domNode.querySelector(`[data-account-number="${accountNumber.number}:${accountNumber.currency}"]`))
  }

  async getAccounts(currency) {
    // We're ignoring the currency argument - just build accounts for everything that's rendered
    return [...this._$domNode.querySelectorAll('[data-type="Account"]')].map(makeAccount)
  }
}

const makeAccount = $account => ({
  accountNumber: {
    number: $account.querySelector('[aria-label="Owner"]').textContent,
    currency: $account.querySelector('[aria-label="Currency"]').textContent,
  },
  balance: parseInt($account.querySelector('[aria-label="Balance"]').textContent),
})
