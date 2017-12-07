const DomBankQueries = require('../../../lib/bank-queries/DomBankQueries')
const DomTransferCommands = require('../../../lib/transfer/DomTransferCommands')

module.exports = class DomTestAssembly {
  constructor({ $domNode, sub }) {
    this.sub = sub
    this.bankQueries = new DomBankQueries({ $domNode })
    this.transferCommands = new DomTransferCommands({ $domNode })
  }
}