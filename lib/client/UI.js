const { h } = require('preact')
const hyperx = require('hyperx')
const hx = hyperx(h)

const Account = ({ account }) => hx`
  <div data-account-number=${account.accountNumber} data-type="Account">
    <span aria-label="AccountNumber">${account.accountNumber}</span>
    <span aria-label="Balance">${account.balance}</span>
    <input type="text" aria-label="Amount"/>
    <button aria-label="Transfer">Transfer</button>
  </div>`

const AccountList = ({ accounts }) => hx`
  <div>
    ${accounts.map(account => Account({ account }))}    
  </div>`


module.exports = { Account, AccountList }