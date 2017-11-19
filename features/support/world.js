const { setWorldConstructor, Before, After } = require('cucumber')

const assemblyName = process.env.CUCUMBER_ASSEMBLY || 'memory'
console.log(`🥒 ${assemblyName}`)

const AssemblyModule = require(`./assemblies/${assemblyName}`)
setWorldConstructor(AssemblyModule)

Before(function() {
  return this.start()
})

After(function() {
  return this.stop()
})
