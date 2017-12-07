module.exports = class DomBankQueries {
  constructor({ $domNode }) {
    if (!$domNode) throw new Error('No $domNode')
    this._$domNode = $domNode
  }

  async getAccountHolder(id) {
    return makeAccountHolderStruct(this._$domNode.querySelector(`[data-account-holder-id="${id}"]`))
  }

  async getAccount(id) {
    return makeAccountStruct(this._$domNode.querySelector(`[data-account-id="${id}"]`))
  }

  async getAccountHolders() {
    return [...this._$domNode.querySelectorAll('[data-type="Account Holder"]')].map(makeAccountHolderStruct)
  }
}

const makeAccountHolderStruct = $accountHolder => ({
  id: $accountHolder.dataset.accountHolderId,
  name: $accountHolder.querySelector('[aria-label="Account Holder Name"]').textContent,
  accounts: [...$accountHolder.querySelectorAll('[data-type="Account"]')].map(makeAccountStruct)
})

const makeAccountStruct = $account => ({
  id: $account.dataset.accountId,
  currency: $account.querySelector('[aria-label="Currency"]').textContent,
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
