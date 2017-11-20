module.exports = class HttpTransferCommands {
  constructor(baseUrl, fetch) {
    this._baseUrl = baseUrl
    this._fetch = fetch
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
}