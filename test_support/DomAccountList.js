module.exports = class DomAccountList {
  constructor($node) {
    this.$node = $node
  }

  getAccounts() {
    return [...this.$node.querySelectorAll('[data-type="Account"]')].map($account => {
      return {
        accountNumber: $account.querySelector('[aria-label="AccountNumber"]').textContent,
        balance: parseInt($account.querySelector('[aria-label="Balance"]').textContent),
      }
    })
  }
}
