const uuid = require('uuid/v4')
const ServerAssembly = require('./lib/ServerAssembly')
const assembly = new ServerAssembly(true)
const port = parseInt(process.env.PORT || 8080)

async function start() {
  const listenPort = await assembly.webServer.listen(port)
  console.log(`http://localhost:${listenPort}`)

  // Set up some accounts (will do as batch jobs later)

  const aslakId = 'ASLAK-ACCOUNT-HOLDER-ID'
  const aslakVotesId = uuid()
  const aslakDollarsId = uuid()

  const issue1Id = uuid()
  const issue1VotesId = uuid()
  const issue1DollarsId = uuid()

  const issue2Id = uuid()
  const issue2VotesId = uuid()
  const issue2DollarsId = uuid()

  await assembly.accountCommands.createAccount({ accountId: aslakVotesId, currency: 'votes', initialBalance: 5000 })
  await assembly.accountCommands.createAccount({ accountId: aslakDollarsId, currency: 'USD', initialBalance: 100 })
  await assembly.accountHolderCommands.createAccountHolder({ accountHolderId: aslakId, name: '@aslakhellesoy' })
  await assembly.accountHolderCommands.grantAccountAccess({ accountHolderId: aslakId, accountId: aslakVotesId })
  await assembly.accountHolderCommands.grantAccountAccess({ accountHolderId: aslakId, accountId: aslakDollarsId })

  await assembly.accountCommands.createAccount({ accountId: issue1VotesId, currency: 'votes', initialBalance: 0 })
  await assembly.accountCommands.createAccount({ accountId: issue1DollarsId, currency: 'USD', initialBalance: 0 })
  await assembly.accountHolderCommands.createAccountHolder({ accountHolderId: issue1Id, name: 'cucumber/cucumber#1' })
  await assembly.accountHolderCommands.grantAccountAccess({ accountHolderId: issue1Id, accountId: issue1VotesId })
  await assembly.accountHolderCommands.grantAccountAccess({ accountHolderId: issue1Id, accountId: issue1DollarsId })

  await assembly.accountCommands.createAccount({ accountId: issue2VotesId, currency: 'votes', initialBalance: 0 })
  await assembly.accountCommands.createAccount({ accountId: issue2DollarsId, currency: 'USD', initialBalance: 0 })
  await assembly.accountHolderCommands.createAccountHolder({ accountHolderId: issue2Id, name: 'cucumber/cucumber#2' })
  await assembly.accountHolderCommands.grantAccountAccess({ accountHolderId: issue2Id, accountId: issue2VotesId })
  await assembly.accountHolderCommands.grantAccountAccess({ accountHolderId: issue2Id, accountId: issue2DollarsId })
}

start().catch(err => console.error(err))

