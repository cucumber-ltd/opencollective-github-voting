const { JSDOM } = require('jsdom')
const PreactAssembly = require('../../lib/client/PreactAssembly')
const DomTestAssembly = require('../../test_support/DomTestAssembly')
const DomAccountQueries = require('../../test_support/DomAccountQueries')
const verifyContract = require('./verifyAccountQueriesContract')

describe('DomAccountQueries', () => {
  verifyContract(async ({ sub, accountQueries }) => {
    const dom = new JSDOM(`<!DOCTYPE html>`)
    const document = dom.window.document
    global.document = document
    const $domNode = document.body

    const transferCommands = {} // We're not interacting with it in this contract
    const preactAssembly = new PreactAssembly({ $domNode, sub, transferCommands, accountQueries })
    await preactAssembly.start()
    const domTestAssembly = new DomTestAssembly({ $domNode, sub })

    return domTestAssembly.accountQueries
  })
})
