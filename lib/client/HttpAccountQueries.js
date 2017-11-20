module.exports = class HttpAccountQueries {
  constructor(baseUrl, fetch) {
    this._baseUrl = baseUrl
    this._fetch = fetch
  }

  async getAccount(accountNumber) {
    const url = `${this._baseUrl}/accounts/${encodeURIComponent(accountNumber.owner)}/${encodeURIComponent(accountNumber.currency)}`
    const res = await this._fetch(url)
    if (res.status !== 200)
      throw new Error(`GET ${url} - ${res.status}: ${await res.text()}`)
    return (await res.json())
  }
}