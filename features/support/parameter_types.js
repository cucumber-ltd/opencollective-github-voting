const { join } = require('path')
const promisify = require('util.promisify')
const glob = promisify(require('glob'))
const readFile = promisify(require('fs').readFile)
const { defineParameterType } = require('cucumber')

const fixturePath = `${__dirname}/../../test_support/fixtures`

async function readJson(path) {
  const json = await readFile(join(fixturePath, path))
  return JSON.parse(json)
}

defineParameterType({
  name: 'accountNumber',
  regexp: /([\w-@#/]+):([\w-]+)/,
  transformer(owner, currency) {
    return { owner, currency }
  }
})

defineParameterType({
  name: 'currency',
  regexp: /commits|USD/,
})

defineParameterType({
  name: 'fixture',
  regexp: /[\w-/]+\.\w+/,
  transformer: async function(path) {
    return await readJson(path)
  }
})

defineParameterType({
  name: 'fixtures',
  regexp: /[\w-*/]+\.\w+/,
  transformer: async function(pathGlob) {
    console.log('pathGlob', pathGlob)
    const paths = await glob(pathGlob, { cwd: fixturePath })
    const pages = []
    for (const path of paths) {
      const page = await readJson(path)
      pages.push(page)
    }
    return pages
  }
})
