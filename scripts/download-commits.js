const { Transform } = require('stream')
const GithubCommitsStream = require('../lib/commits/GitHubCommitsStream')

const commitsStream = new GithubCommitsStream({
  owner: 'cucumber',
  repo: 'cucumber',
  author: 'aslakhellesoy',
  token: process.env['REWARD_GITHUB_OAUTH_SECRET']
})

commitsStream.on('error', err => console.error('ERROR', err))

commitsStream
  .pipe(new Transform({
    objectMode: true, transform(results, _, cb) {
      cb(null, JSON.stringify(results) + "\n")
    }
  }))
  .pipe(process.stdout)