const { defineParameterType } = require('cucumber')

defineParameterType({
  name: 'accountNumber',
  regexp: /([\w@#/]+):(\w+)/,
  transformer(owner, currency) {
    return { owner, currency }
  }
})
