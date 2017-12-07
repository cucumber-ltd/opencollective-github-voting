const { JSDOM } = require('jsdom')
const PreactAssembly = require('../PreactAssembly')
const DomTestAssembly = require('../../features/support/assemblies/DomTestAssembly')
const verifyContract = require('./verifyBankQueriesContract')

describe('DomBankQueries', () => {
  verifyContract(async ({ accountHolderId, sub, bankQueries }) => {
    const dom = new JSDOM(`<!DOCTYPE html>`)
    const document = dom.window.document
    global.document = document
    const $domNode = document.body

    const transferCommands = {}
    const preactAssembly = new PreactAssembly({ $domNode, accountHolderId, sub, transferCommands, bankQueries })
    await preactAssembly.start()
    const domTestAssembly = new DomTestAssembly({ $domNode, sub })

    return domTestAssembly.bankQueries
  })
})
