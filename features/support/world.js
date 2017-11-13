const { setWorldConstructor, Before, After } = require('cucumber')

const assemblyName = process.env.CUCUMBER_ASSEMBLY || 'memory'
console.log(`🥒 ${assemblyName}`)

const AssemblyModule = require(`./assemblies/${assemblyName}`)
const assembly = new AssemblyModule()

class TheWorld {
  constructor() {
    // From Assembly
    this.eventStore = () => assembly.eventStore
    this.commandBus = () => assembly.commandBus
    this.repository = () => assembly.repository

    // From Test Assembly
    this.votingPort = () => assembly.votingPort
  }
}

setWorldConstructor(TheWorld)

Before(function() {
  return assembly.start()
})

After(function() {
  return assembly.stop()
})
