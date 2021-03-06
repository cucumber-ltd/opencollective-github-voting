const { defineParameterType } = require('cucumber')
const { readFile } = require('fs')
const promisify = require('util.promisify')
const readFileAsync = promisify(readFile)

defineParameterType({
  name: 'issue',
  regexp: /#[\w-/]+/,
})

defineParameterType({
  name: 'gitHubUser',
  regexp: /[\w-/]+/,
})

defineParameterType({
  name: 'currency',
  regexp: /(votes|commit-days|USD)/,
})


defineParameterType({
  name: 'fixture',
  regexp: /[\w-/]+\.\w+/,
  transformer: async function(path) {
    const json = await readFileAsync(`${__dirname}/../../test_support/fixtures/${path}`)
    return JSON.parse(json)
  }
})
