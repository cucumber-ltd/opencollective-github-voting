const { setWorldConstructor, Before, After } = require('cucumber')

const assemblyName = process.env.CUCUMBER_ASSEMBLY || 'memory'
console.log(`🥒 ${assemblyName}`)

const AssemblyModule = require(`./assemblies/${assemblyName}`)
const assembly = new AssemblyModule()

class TheWorld {
  constructor() {
    // From Assembly
    this.commandBus = () => assembly.commandBus

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
