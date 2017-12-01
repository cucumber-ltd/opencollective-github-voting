module.exports = class DomAccountQueries {
  constructor({ $domNode }) {
    if (!$domNode) throw new Error('No $domNode')
    this._$domNode = $domNode
  }

  async getUser(username) {
    throw new Error('TODO fixme')
  }

  async getAccount(accountNumber) {
    return makeAccountStruct(this._$domNode.querySelector(`[data-account-number="${accountNumber.number}:${accountNumber.currency}"]`))
  }

  async getAccounts(currency) {
    // We're ignoring the currency argument - just build accounts for everything that's rendered
    return [...this._$domNode.querySelectorAll('[data-type="Account"]')].map(makeAccountStruct)
  }
}

const makeAccountStruct = $account => ({
  accountNumber: {
    number: $account.querySelector('[aria-label="Owner"]').textContent,
    currency: $account.querySelector('[aria-label="Currency"]').textContent,
  },
  balance: parseInt($account.querySelector('[aria-label="Balance"]').textContent),
  transactions: [...$account.querySelectorAll('[data-type="Transaction"]')].map(makeTransactionStruct)
})

const makeTransactionStruct = $transaction => {
  const creditAmountString = $transaction.querySelector('[aria-label="CreditAmount"]').textContent
  const debitAmountString = $transaction.querySelector('[aria-label="DebitAmount"]').textContent
  const amount = parseInt(creditAmountString !== '' ? creditAmountString : debitAmountString)
  const type = creditAmountString !== '' ? 'credit' : 'debit'
  return {
    amount,
    type,
    uniqueReference: $transaction.querySelector('[aria-label="TransactionReference"]').textContent
  }
}
