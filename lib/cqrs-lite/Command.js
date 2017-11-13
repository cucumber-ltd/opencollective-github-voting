module.exports = class Command {
  constructor(attributes) {
    this._attributes = attributes
  }

  get attributes() {
    return this._attributes
  }
}