module.exports = class MemoryUserStore {
  async findUser(username) {
    return {
      voteCount: 5
    }
  }
}