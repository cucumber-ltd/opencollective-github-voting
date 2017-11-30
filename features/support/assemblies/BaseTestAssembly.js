module.exports = class BaseTestAssembly {
  // Given

  get contextAccountCommands() {
    return this._contextAssembly.accountCommands
  }

  // When

  get actionTransferCommands() {
    return this._actionAssembly.transferCommands
  }

  get actionUserCommands() {
    return this._actionAssembly.userCommands
  }

  get openCollectiveImporter() {
    return this._actionAssembly.openCollectiveImporter
  }

  // Then

  get accountQueries() {
    return this._outcomeAssembly.accountQueries
  }

  get pubSub() {
    return this._contextAssembly.pubSub
  }
}