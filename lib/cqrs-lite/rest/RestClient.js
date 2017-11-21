module.exports = class Rest {
  constructor(baseUrl, fetch, EventSource) {
    this._baseUrl = baseUrl
    this._fetch = fetch
    this._EventSource = EventSource
  }

  async post(path, body) {
    const url = this._url(path)
    const res = await this._fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })
    if (res.status !== 201)
      throw new Error(`POST ${url} - ${res.status}: ${await res.text()}`)
  }

  async get(path) {
    const url = this._url(path)
    const res = await this._fetch(url, {
      method: 'get',
      headers: {
        'Accept': 'application/json'
      }
    })
    if (res.status !== 200)
      throw new Error(`GET ${url} - ${res.status}: ${await res.text()}`)
    return res.json()
  }

  newEventSource(path) {
    return new this._EventSource(this._url(path))
  }

  _url(path) {
    return `${this._baseUrl}${path}`
  }
}
