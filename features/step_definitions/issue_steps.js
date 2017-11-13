const { Given } = require('cucumber')

Given('{issueIdentifier} exists', function (issueIdentifier) {
  return this.eventStore().storeEvent({
    type: 'IssueCreated',
    data: {
      issueIdentifier
    }
  })
})