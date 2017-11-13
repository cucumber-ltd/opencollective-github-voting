const { defineParameterType } = require('cucumber')

defineParameterType({
  name: 'username',
  regexp: /@(\w+)/,
  transformer(username) {
    return username
  }
})

defineParameterType({
  name: 'issueIdentifier',
  regexp: /\w+\/\w+#\d+/,
  transformer(username) {
    return username
  }
})