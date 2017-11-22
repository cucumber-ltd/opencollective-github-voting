const AppAssembly = require('./lib/AppAssembly')
const assembly = new AppAssembly()
const port = parseInt(process.env.PORT || 8080)

async function start() {
  const listenPort = await assembly.webServer.listen(port)
  console.log(`http://localhost:${listenPort}`)

  // Set up some accounts (will do as batch jobs later)
  const A = assembly.accountCommands
  const X = assembly.transferCommands

  const i250Votes = {owner: 'cucumber/cucumber#250', currency: 'votes'}
  await A.createAccount(i250Votes)

  const aslakVotes = {owner: '@aslakhellesoy', currency: 'votes'}
  await A.createAccount(aslakVotes)

  const aslakDollars = {owner: '@aslakhellesoy', currency: 'USD'}
  await A.createAccount(aslakDollars)
  await A.creditAccount(aslakDollars, 500, 'opencollective-234123412341')
  await X.transfer(aslakDollars, aslakVotes, 400)
}

start().catch(err => console.error(err))

