const { setWorldConstructor, Before, After } = require('cucumber')

const assemblyName = process.env.CUCUMBER_ASSEMBLY || 'memory'
console.log(`🥒 ${assemblyName}`)

const AssemblyModule = require(`./assemblies/${assemblyName}`)
const assembly = new AssemblyModule()

class TheWorld {
  constructor() {
    this.contextVotingPort = () => assembly.contextVotingPort()
    this.actionVotingPort = () => assembly.actionVotingPort()
    this.outcomeVotingPort = () => assembly.outcomeVotingPort()
  }
}

setWorldConstructor(TheWorld)

Before(function() {
  return assembly.start()
})

After(function() {
  return assembly.stop()
})
