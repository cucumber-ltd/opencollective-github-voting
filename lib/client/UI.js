const { h, Component } = require('preact')
const hyperx = require('hyperx')
const hx = hyperx(h)

// Higher-order Component
class VotingApp extends Component {
  /**
   *
   * @param props - {transferCommands, accountQueries, accountNumber}
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
    const currencyAccountUpdated = async () => {
      try {
        // Get all accounts again and trigger a rerender
        const accounts = await this.props.accountQueries.getAccounts(currency)
        this.setState({ accounts })
      } catch (err) {
        // TODO: Display error
        console.error('Failed to get accounts:', err)
      }
    }
    // Tell me whenever there is a change to a "votes" account
    const subscriptionKey = { type: 'currency', filter: currency }
    this.props.accountQueries.subscribe(subscriptionKey, currencyAccountUpdated)
      .catch(err => console.error('Failed to subscribe', err))
  }

  render({}, { accounts }) {
    return hx`
      <div>
        <h1>
          <span aria-label="MyAccountOwner">${this.props.accountNumber.number}</span>
          <span aria-label="MyAccountCurrency">${this.props.accountNumber.currency}</span>
        </h1>
        ${AccountList({ accounts, transferAmountTo: this.transferAmountTo })}    
      </div>`
  }
}

const AccountList = ({ accounts, transferAmountTo }) => {
  return hx`
    <ol>
      <thead>
        <th>Issue</th>
        <th>Currency</th>
        <th>Votes</th>
        <th>Vote!</th>
      </thead>
      <tbody>
        ${accounts.map(account => Account({ account, transferAmountTo }))}    
      </tbody>
    </ol>`
}

const Account = ({ account, transferAmountTo }) => {
  const transferAmount = amount => {
    transferAmountTo(account.accountNumber, amount)
  }
  return hx`
    <tr data-account-number="${account.accountNumber.number}:${account.accountNumber.currency}" data-type="Account">
      <td aria-label="Owner">${account.accountNumber.number}</td>
      <td aria-label="Currency">${account.accountNumber.currency}</td>
      <td aria-label="Balance">${account.balance}</td>
      <td>${h(TransferForm, { transferAmount })}</td>
    </tr>`
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