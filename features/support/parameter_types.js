const { defineParameterType } = require('cucumber')
const { readFile } = require('fs')
const promisify = require('util.promisify')
const readFileAsync = promisify(readFile)

defineParameterType({
  name: 'username',
  regexp: /(@[\w-#/]+)/,
})

defineParameterType({
  name: 'accountNumber',
  regexp: /([\w-@#/]+):(\w+)/,
  transformer(number, currency) {
    return { number, currency }
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
