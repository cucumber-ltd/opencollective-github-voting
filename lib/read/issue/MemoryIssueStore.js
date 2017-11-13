module.exports = class MemoryIssueStore {
  async findIssue(issueIdentifier) {
    return {
      voteCount: 12
    }
  }
}