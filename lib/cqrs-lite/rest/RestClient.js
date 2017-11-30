module.exports = class RestClient {
  constructor({ fetch, EventSource }) {
    if (!fetch) throw new Error('Missing fetch')
    if (!EventSource) throw new Error('Missing EventSource')
    this._fetch = fetch
    this._EventSource = EventSource
  }

  async start({ baseUrl }) {
    this._baseUrl = baseUrl
  }

  async post(path, bodyObject) {
    const url = this._url(path)
    let contentType, body
    if (!bodyObject || typeof bodyObject === 'string') {
      contentType = 'text/plain'
      body = bodyObject || ''
    } else {
      contentType = 'application/json'
      body = JSON.stringify(bodyObject)
    }

    const headers = {
      'Content-Type': contentType,
      'Accept': 'application/json'
    }
    const res = await this._fetch(url, {
      method: 'post',
      headers,
      body
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
    if(!this._baseUrl) throw new Error('Not started yet')
    return `${this._baseUrl}${path}`
  }
}
