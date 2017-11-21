const { defineParameterType } = require('cucumber')
const { readFile } = require('fs')
const promisify = require('util.promisify')
const readFileAsync = promisify(readFile)

defineParameterType({
  name: 'accountNumber',
  regexp: /([\w-@#/]+):(\w+)/,
  transformer(owner, currency) {
    return { owner, currency }
  }
})

defineParameterType({
  name: 'fixture',
  regexp: /[\w-/]+\.\w+/,
  transformer: async function(path) {
    const json = await readFileAsync(`${__dirname}/../../test_support/fixtures/${path}`)
    return JSON.parse(json)
  }
})
