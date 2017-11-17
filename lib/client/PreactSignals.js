module.exports = class PreactSignals {
  set accountProjection(accountProjection) {
    this._accountProjection = accountProjection
  }

  async accountCreated(accountNumber) {
    console.log("PREACT: accountCreated", accountNumber)
    const account = this._accountProjection.getAccount(accountNumber)
    console.log(account)
    if(!this._accountProjection) throw new Error('Missing accountProjection')
  }

  async accountUpdated(accountNumber) {
    console.log("PREACT: accountUpdated", accountNumber)
    const account = this._accountProjection.getAccount(accountNumber)
    console.log(account)
    if(!this._accountProjection) throw new Error('Missing accountProjection')
  }
}