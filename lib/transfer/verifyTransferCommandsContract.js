const assert = require('assert')
const TransferCommands = require('./TransferCommands')

module.exports = function verifyContract(makeTransferCommands) {

  let transferCommands
  beforeEach(async() => {
    const transferCommands = new TransferCommands()
  })

  describe('TransferCommands contract', () => {
    it("submits TransferCommand on transfer", () => {
    })
  })
}
