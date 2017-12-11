const { Given, When, Then } = require('cucumber')

Given('the following commits have been made:', function(commitsTable) {
  this.context.commitsProvider.setCommits(commitsTable.hashes())
})

When('commits are imported', async function() {
  // TODO: This shouldn't hang off context, but something else - not sure what to name it
  await this.context.commitDaysUpdater.importCommits()
});