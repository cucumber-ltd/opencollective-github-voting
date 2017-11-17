const assert = require('assert')
const { render } = require('preact')
const { JSDOM } = require('jsdom')

const { AccountList } = require('../../lib/client/UI')
const DomAccountList = require('../../test_support/DomAccountList')

describe('UI', () => {

  let document
  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html>`)
    document = dom.window.document
    global.document = document
  })

  it("renders accounts in a list", () => {
    const accounts = [
      {
        accountNumber: 'cucumber/cucumber#250',
        balance: 20,
      },
      {
        accountNumber: 'cucumber/cucumber#250',
        balance: 20,
      }
    ]

    render(AccountList({ accounts }), document.body)
    const accountList = new DomAccountList(document.body)

    assert.deepEqual(accountList.getAccounts(), accounts)
  })
})
