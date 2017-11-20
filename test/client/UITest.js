const assert = require('assert')
const sinon = require('sinon')
const { h, render } = require('preact')
const { JSDOM } = require('jsdom')

const { AccountList, VotingApp } = require('../../lib/client/UI')
const AccountStore = require('../../lib/read/AccountQueries')
const DomAccountList = require('../../test_support/DomAccountQueries')
const DomVotingPort = require('../../test_support/DomTransferCommands')

// TODO: Turn this into a contract test? Could be done, but that would be very similar to the cukes

const accounts = [
  {
    uid: 1,
    accountNumber: { owner: 'cucumber/cucumber#250', currency: 'votes' },
    balance: 21,
  },
  {
    uid: 2,
    accountNumber: { owner: 'cucumber/cucumber#350', currency: 'votes' },
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
    const accountList = new DomAccountList(document.body)

    assert.deepEqual(await accountList.getAccounts('votes'), accounts)
  })

  it("makes a transfer", async () => {
    const accountNumber = { owner: '@aslak', currency: 'votes' }

    const votingPort = {
      transfer: sinon.spy(() => Promise.resolve())
    }

    const accountStore = new AccountStore()

    const domNode = document.body
    const props = { votingPort, accountStore, accountNumber }
    render(h(VotingApp, props), domNode)
    const domVotingPort = new DomVotingPort(document.body)
    await accountStore.storeAccount(accounts[0])
    await accountStore.storeAccount(accounts[1])

    // TODO: DOM should have own account too, so it knows what to pass in as from,
    // but also so it doesn't allow transferring more than the balance
    await domVotingPort.transfer(accountNumber, accounts[1].accountNumber, 7)

    assert.deepEqual(votingPort.transfer.getCall(0).args[0], accountNumber)
    assert.deepEqual(votingPort.transfer.getCall(0).args[1], accounts[1].accountNumber)
    assert.deepEqual(votingPort.transfer.getCall(0).args[2], 7)

  })
})
