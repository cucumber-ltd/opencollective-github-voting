const { h, Component } = require('preact')
const hyperx = require('hyperx')
const hx = hyperx(h)

class BankApp extends Component {
  constructor(props) {
    super(props)
    this.state = { accountHolders: [] }
  }

  componentDidMount() {
    this._streamState()
      .catch(err => console.error('Failed to subscribe', err))
  }

  async _streamState() {
    const rerender = async () => {
      const accountHolder = await this.props.bankQueries.getAccountHolder(this.props.accountHolderId)
      const accountHolders = await this.props.bankQueries.getAccountHolders()
      const transfer = ({ toAccountId, currency, amount }) => {
        const fromAccount = accountHolder.accounts.find(account => account.currency === currency)
        const fromAccountId = fromAccount.id
        this.props.transferCommands.transfer({ fromAccountId, amount, toAccountId })
          .catch(err => console.error('ERROR', err.stack))
      }
      this.setState({ accountHolders, transfer })
    }
    await rerender()
    await this.props.sub.subscribe('BANK', rerender)
  }

  render({}, { accountHolders, transfer }) {
    return hx`
      <div>
        <h1>Account Holders</h1>
        ${accountHolders.map(accountHolder => AccountHolder({ accountHolder, transfer }))}
      </div>`
  }
}

const AccountHolder = ({ accountHolder, transfer }) => {
  const makeTransfer = account => amount => transfer({ toAccountId: account.id, currency: account.currency, amount })
  return hx`
    <div data-account-holder-id="${accountHolder.id}" data-type="Account Holder">
      <h2 aria-label="Account Holder Name">${accountHolder.name}</h2>
      ${accountHolder.accounts.map(account => Account({ account, transfer: makeTransfer(account) }))}
    </div>`
}

const Account = ({ account, transfer }) => {
  return hx`
    <div data-account-id="${account.id}" data-type="Account">
      <h3>
        <span aria-label="Balance">${account.balance}</span>
        <span aria-label="Currency">${account.currency}</span>
      </h3>
      ${h(TransferForm, { transfer })}
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
    // TODO: Validate it's an int
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.props.transfer(parseInt(this.state.value))
    event.preventDefault();
  }

  render() {
    return hx`
      <form onSubmit=${this.handleSubmit}>
        <input aria-label="Transfer Amount" type="text" value=${this.state.value} onChange=${this.handleChange} />
        <input aria-label="Transfer" type="submit" value="Transfer" />
      </form>`
  }
}

module.exports = { BankApp }