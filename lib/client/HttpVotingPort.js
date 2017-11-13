module.exports = class HttpVotingPort {
  constructor(baseUrl, fetch) {
    this._baseUrl = baseUrl
    this._fetch = fetch || require('node-fetch')
  }

  async createAccount(accountName) {
    throw new Error('Unsupported Operation')
  }

  async creditAccount(accountName, amount) {
    throw new Error('Unsupported Operation')
  }

  async transfer(fromAccountName, toAccountName, amount) {
    let url = `${this._baseUrl}/transfers`
    const res = await this._fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fromAccountName, toAccountName, amount })
    })
    if (res.status !== 201)
      throw new Error(`POST ${url} - ${res.status}: ${await res.text()}`)
  }

  async getBalance(accountName) {
    let url = `${this._baseUrl}/accounts/${encodeURIComponent(accountName)}`
    const res = await this._fetch(url)
    if (res.status !== 200)
      throw new Error(`GET ${url} - ${res.status}: ${await res.text()}`)
    return (await res.json())
  }
}