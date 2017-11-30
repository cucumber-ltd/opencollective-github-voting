module.exports = class Rest {
  constructor(baseUrl, fetch, EventSource) {
    this._baseUrl = baseUrl
    this._fetch = fetch
    this._EventSource = EventSource
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
    return `${this._baseUrl}${path}`
  }
}
