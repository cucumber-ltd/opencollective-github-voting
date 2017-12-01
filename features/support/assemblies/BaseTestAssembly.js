module.exports = class BaseTestAssembly {

  // For flusing scheduled signals

  get pub() {
    return this._contextAssembly.sub
  }

  // Given

  get contextAccountCommands() {
    return this._contextAssembly.accountCommands
  }

  // When

  get actionSub() {
    return this._actionAssembly.sub
  }

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

  get outcomeSub() {
    return this._outcomeAssembly.sub
  }

  get outcomeAccountQueries() {
    return this._outcomeAssembly.accountQueries
  }
}