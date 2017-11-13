const assert = require('assert')
const { Given, When, Then } = require('cucumber')

Given('{username} has {int} votes', function (username, count) {
  this.eventStore().storeEvent({
    type: 'VotesAttributedToUser',
    data: {
      username,
      count
    }
  })
})

Given('{issueIdentifier} has {int} votes', function (issueIdentifier, count) {
  this.eventStore().storeEvent({
    type: 'VotesCastByUser',
    data: {
      issueIdentifier,
      count,
      username: 'randomuser'
    }
  })
})

When('{username} votes {int} on {issueIdentifier}', function (username, count, issueIdentifier) {
  this.commandBus().dispatchCommand({
    type: 'UserVote',
    data: {
      username,
      count,
      issueIdentifier
    }
  })
})

Then('{issueIdentifier} should have {int} votes', async function (issueIdentifier, count) {
  const issue = await this.store().issue.findIssue(issueIdentifier)
  assert.equal(issue.voteCount, count)
})

Then('{username} should have {int} votes left', async function (username, count) {
  const user = await this.store().user.findUser(username)
  assert.equal(user.voteCount, count)
})