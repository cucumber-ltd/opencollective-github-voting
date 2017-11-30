const assert = require('assert')
const sinon = require('sinon')
const { h, render } = require('preact')
const { JSDOM } = require('jsdom')

const SigSub = require('../../lib/cqrs-lite/sigsub/SigSub')
const { AccountList, VotingApp } = require('../../lib/client/UI')
const AccountQueries = require('../../lib/read/AccountQueries')
const DomAccountQueries = require('../../test_support/DomAccountQueries')
const DomTransferCommands = require('../../test_support/DomTransferCommands')

// TODO: Turn this into a contract test? Could be done, but that would be very similar to the cukes

const accounts = [
  {
    accountNumber: { number: 'cucumber/cucumber#250', currency: 'votes' },
    balance: 21,
  },
  {
    accountNumber: { number: 'cucumber/cucumber#350', currency: 'votes' },
    balance: 11,
  }
]

describe('UI', () => {

  let document
  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html>`)
    document = dom.window.document
    global.document = document
  })

  it("renders accounts in a list", async () => {
    render(AccountList({ accounts }), document.body)
    const accountQueries = new DomAccountQueries(document.body)

    assert.deepEqual(await accountQueries.getAccounts('votes'), accounts)
  })

  it("makes a transfer", async () => {
    const accountNumber = { number: '@aslak', currency: 'votes' }

    const transferCommands = {
      transfer: sinon.spy(() => Promise.resolve())
    }

    const sigSub = new SigSub()
    const accountQueries = new AccountQueries(sigSub)

    const domNode = document.body
    const props = { transferCommands, accountQueries, accountNumber }
    render(h(VotingApp, props), domNode)
    const domTransferCommands = new DomTransferCommands(document.body)

    // We're using the write API of AccountQueries
    await accountQueries.storeAccount('entity-uid-1', accounts[0])
    await accountQueries.storeAccount('entity-uid-1', accounts[1])
    await sigSub.flushScheduledSignals()

    // TODO: DOM should have own account too, so it knows what to pass in as from,
    // but also so it doesn't allow transferring more than the balance
    await domTransferCommands.transfer(accountNumber, accounts[1].accountNumber, 7)

    assert.deepEqual(transferCommands.transfer.getCall(0).args[0], accountNumber)
    assert.deepEqual(transferCommands.transfer.getCall(0).args[1], accounts[1].accountNumber)
    assert.deepEqual(transferCommands.transfer.getCall(0).args[2], 7)

  })
})
