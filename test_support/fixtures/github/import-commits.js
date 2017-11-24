const writeFile = require('util').promisify(require('fs').writeFile)
const GitHub = require('github')
const github = new GitHub()

async function get() {
  let page = 0
  const write = async function(result) {
    await writeFile(__dirname + `/commits-${++page}.json`, JSON.stringify(result, null, 2), 'utf-8')
    console.log(`Wrote ${page}`)
  }

  let result = await github.repos.getCommits({
    per_page: 100,
    owner: 'cucumber',
    repo: 'cucumber',
    author: 'aslakhellesoy'
  })
  await write(result)

  while (github.hasNextPage(result)) {
    result = await github.getNextPage(result)
    await write(result)
  }
}

get().catch(err => console.error(err))