const { Given } = require('cucumber')

Given('{username} exists', function (user) {
  return this.eventStore().storeEvent({
    type: 'UserCreated',
    data: {
      user
    }
  })
})