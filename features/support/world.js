const { setWorldConstructor, Before, After } = require('cucumber')

const assemblyName = process.env.CUCUMBER_ASSEMBLY || 'memory'
console.log(`🥒 ${assemblyName}`)

const AssemblyModule = require(`./assemblies/${assemblyName}`)
const assembly = new AssemblyModule()

class TheWorld {
  constructor() {
    this.eventStore = () => assembly.eventStore
    this.commandBus = () => assembly.commandBus
    this.repository = () => assembly.repository
    this.store = () => assembly.store
  }
}

setWorldConstructor(TheWorld)

Before(function() {
  return assembly.start()
})

After(function() {
  return assembly.stop()
})
