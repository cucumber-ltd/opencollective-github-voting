const { h, Component } = require('preact')
const hyperx = require('hyperx')
const hx = hyperx(h)

// Higher-order Component
class VotingApp extends Component {
  /**
   *
   * @param props - {sub, transferCommands, accountQueries, accountNumber}
   */
  constructor(props) {
    super(props)
    this.state = { accounts: [] }
    this.transferAmountTo = (toAccountNumber, amount) => {
      this.props.transferCommands.transfer(this.props.accountNumber, toAccountNumber, amount)
        .then(() => {
          // TODO: Display confirmation
        })
        .catch(err => {
          // TODO: Display error
          console.error('Transfer failed', err)
        })
    }
  }

  componentDidMount() {
    const currency = this.props.accountNumber.currency
    const rerender = async () => {
      try {
        // Get all accounts again and trigger a rerender
        const accounts = await this.props.accountQueries.getAccounts(currency)
        this.setState({ accounts })
      } catch (err) {
        // TODO: Display error
        console.error('Failed to get accounts:', err)
      }
    }
    this.props.sub.subscribe('ACCOUNTS', rerender)
      .catch(err => console.error('Failed to subscribe', err))
  }

  render({}, { accounts }) {
    return hx`
      <div>
        <h1>
          <span aria-label="MyAccountOwner">${this.props.accountNumber.number}</span>
          <span aria-label="MyAccountCurrency">${this.props.accountNumber.currency}</span>
        </h1>
        ${User({ username: '@bob' })}
        ${AccountList({ accounts, transferAmountTo: this.transferAmountTo })}    
      </div>`
  }
}

const User = ({ username }) => {
  return hx`
    <div>
      <span aria-label="MyUsername">${username}</span>
      <button aria-label="Create User">Create user</button>
    </div>
  `
}

const AccountList = ({ accounts, transferAmountTo }) => {
  return hx`
    <div>
      <h1>Accounts</h1>
      ${accounts.map(account => Account({ account, transferAmountTo }))}
    </div>
    `
}

const Account = ({ account, transferAmountTo }) => {
  const transferAmount = amount => {
    transferAmountTo(account.accountNumber, amount)
  }
  return hx`
    <div data-account-number="${account.accountNumber.number}:${account.accountNumber.currency}" data-type="Account">
      <span aria-label="Owner">${account.accountNumber.number}</span>
      <span aria-label="Currency">${account.accountNumber.currency}</span>
      <span aria-label="Balance">${account.balance}</span>
      ${h(TransferForm, { transferAmount })}
      ${h(TransactionTable, { transactions: account.transactions })}
    </div>`
}

const TransactionTable = ({ transactions }) => {
  return hx`
    <table>
      <thead>
        <th>Credit</th>
        <th>Debit</th>
        <th>Reference</th>
      </thead>
      <tbody>
        ${transactions.map(transaction => TransactionRow({ transaction }))}    
      </tbody>
    </table>
  `
}

const TransactionRow = ({ transaction }) => {
  return hx`
    <tr data-type="Transaction">
      <td aria-label="CreditAmount">${transaction.type === 'credit' ? transaction.amount : ''}</td>
      <td aria-label="DebitAmount">${transaction.type === 'debit' ? transaction.amount : ''}</td>
      <td aria-label="TransactionReference">${transaction.uniqueReference}</td>
    </tr>
  `
}

class TransferForm extends Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.props.transferAmount(this.state.value)
    event.preventDefault();
  }

  render() {
    return hx`
      <form onSubmit=${this.handleSubmit}>
        <input aria-label="TransferAmount" type="text" value=${this.state.value} onChange=${this.handleChange} />
        <input aria-label="Transfer" type="submit" value="Transfer" />
      </form>`
  }
}

module.exports = { AccountList, VotingApp }