const fs = require('fs')
const readline = require('readline')
const { Readable } = require('stream')
const GitHubCommitsProvider = require('./GitHubCommitsProvider')
const verifyContract = require('./verifyCommitsProviderContract')

describe('GitHubCommitsProvider', () => {
  verifyContract(() => {
    const getCommitsStream = ({ owner, repo, author, token }) => {
      return new ReadlineStream(fs.createReadStream(__dirname + '/testdata/commits.ndjson'))
    }
    return new GitHubCommitsProvider(getCommitsStream)
  })
})

class ReadlineStream extends Readable {
  constructor(stream) {
    super({ objectMode: true })
    const rl = readline.createInterface({
      input: stream,
    })
    rl.on('line', line => this.push(line))
    rl.on('close', () => this.push(null))
  }

  _read() {}
}