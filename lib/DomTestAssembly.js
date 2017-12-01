const DomAccountQueries = require('./account-queries/DomAccountQueries')
const DomTransferCommands = require('./transfer/DomTransferCommands')
const DomUserCommands = require('./user/DomUserCommands')

module.exports = class DomTestAssembly {
  constructor({ $domNode, sub }) {
    this.accountQueries = new DomAccountQueries({ $domNode })
    this.transferCommands = new DomTransferCommands({ $domNode })
    this.userCommands = new DomUserCommands({ $domNode })
    this.sub = sub
  }
}