const DomAccountQueries = require('./DomAccountQueries')
const DomTransferCommands = require('./DomTransferCommands')
const DomUserCommands = require('./DomUserCommands')

module.exports = class DomTestAssembly {
  constructor({ $domNode }) {
    this.accountQueries = new DomAccountQueries({ $domNode })
    this.transferCommands = new DomTransferCommands({ $domNode })
    this.userCommands = new DomUserCommands({ $domNode })
  }
}