/**
 * Implements both the VotingPort and AccountStore APIs.
 * TODO: Split it then!
 *
 * @type {module.HttpVotingPort}
 */
module.exports = class HttpVotingPort {
  constructor(baseUrl, fetch) {
    this._baseUrl = baseUrl
    this._fetch = fetch
  }

  // TODO: Move out of this interface
  async createAccount(accountNumber) {
    throw new Error('Unsupported Operation')
  }

  async creditAccount(accountNumber, amount) {
    throw new Error('Unsupported Operation')
  }

  async transfer(fromAccountNumber, toAccountNumber, amount) {
    let url = `${this._baseUrl}/transfers`
    const res = await this._fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fromAccountNumber, toAccountNumber, amount })
    })
    if (res.status !== 201)
      throw new Error(`POST ${url} - ${res.status}: ${await res.text()}`)
  }

  async getAccount(accountNumber) {
    let url = `${this._baseUrl}/accounts/${encodeURIComponent(accountNumber.owner)}/${encodeURIComponent(accountNumber.currency)}`
    const res = await this._fetch(url)
    if (res.status !== 200)
      throw new Error(`GET ${url} - ${res.status}: ${await res.text()}`)
    return (await res.json())
  }
}