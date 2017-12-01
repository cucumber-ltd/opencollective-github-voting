const assert = require('assert')
const sinon = require('sinon')
const { h, render } = require('preact')
const { JSDOM } = require('jsdom')

const PubSub = require('../../lib/cqrs-lite/pubsub/PubSub')
const { AccountList, VotingApp } = require('../../lib/client/UI')
const AccountProjector = require('../../lib/read/AccountProjector')
const AccountQueries = require('../../lib/read/AccountQueries')
const DomAccountQueries = require('../../test_support/DomAccountQueries')
const DomTransferCommands = require('../../test_support/DomTransferCommands')

// TODO: Turn this into a contract test? Could be done, but that would be very similar to the cukes

// const accounts = [
//   {
//     accountNumber: { number: 'cucumber/cucumber#250', currency: 'votes' },
//     balance: 21,
//   },
//   {
//     accountNumber: { number: 'cucumber/cucumber#350', currency: 'votes' },
//     balance: 11,
//   }
// ]

xdescribe('UI', () => {
  const username = '@aslak'
  const userUid = 'user-1'
  const accountUid = 'account-1'
  const accountNumber = { number: '@aslak-votes', currency: 'votes' }

  let document, pubSub, accountQueries
  beforeEach(async () => {
    const dom = new JSDOM(`<!DOCTYPE html>`)
    document = dom.window.document
    global.document = document

    pubSub = new PubSub()
    accountQueries = new AccountQueries(pubSub)
    const projector = new AccountProjector(accountQueries)

    await projector.onUserCreatedEvent({ entityUid: userUid, username })
    await projector.onAccountCreatedEvent({ entityUid: accountUid, accountNumber })
    await projector.onAccountAssignedToUserEvent({ entityUid: accountUid, userUid })

    await projector.onAccountCreditedEvent({ entityUid: accountUid, amount: 30, uniqueReference: 'ref-100' })
    await projector.onAccountDebitedEvent({ entityUid: accountUid, amount: 9, uniqueReference: 'ref-101' })
    await projector.onAccountCreditedEvent({ entityUid: accountUid, amount: 11, uniqueReference: 'ref-102' })
    await pubSub.flushScheduledSignals()
  })

  it("renders a user", () => {

  })

  it("renders accounts in a list", async () => {
    const accounts = await accountQueries.getAccounts('votes')

    const $domNode = document.body
    render(AccountList({ accounts }), $domNode)
    const domAccountQueries = new DomAccountQueries({ $domNode })

    const domAccounts = await domAccountQueries.getAccounts('votes')
    assert.deepEqual(domAccounts, accounts)
  })

  it("makes a transfer", async () => {
    const accounts = await accountQueries.getAccounts('votes')

    const transferCommands = {
      transfer: sinon.spy(() => Promise.resolve())
    }

    // const pubSub = new PubSub()
    // const accountQueries = new AccountQueries(pubSub)

    const $domNode = document.body
    const props = { transferCommands, accountQueries, accountNumber }
    render(h(VotingApp, props), $domNode)
    const domTransferCommands = new DomTransferCommands({ $domNode })

    // We're using the write API of AccountQueries
    // await accountQueries.storeAccount('entity-uid-1', accounts[0])
    // await accountQueries.storeAccount('entity-uid-1', accounts[1])
    // await pubSub.flushScheduledSignals()

    // TODO: DOM should have own account too, so it knows what to pass in as from,
    // but also so it doesn't allow transferring more than the balance
    await domTransferCommands.transfer(accountNumber, accounts[0].accountNumber, 7)

    assert.deepEqual(transferCommands.transfer.getCall(0).args[0], accountNumber)
    assert.deepEqual(transferCommands.transfer.getCall(0).args[1], accounts[1].accountNumber)
    assert.deepEqual(transferCommands.transfer.getCall(0).args[2], 7)

  })
})
