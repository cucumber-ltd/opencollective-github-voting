const ServerAssembly = require('../lib/ServerAssembly')
const assembly = new ServerAssembly()

function recurse(path, stack) {
  for (const child of stack) {
    if (child.method) {
      const pad = '     '
      const paddedVerb = (child.method.toUpperCase() + pad).substring(0, pad.length)
      console.log(paddedVerb, path)
    }

    if (child.handle && child.handle.stack) {
      recurse(path, child.handle.stack)
    }
    if (child.route) {
      recurse(child.route.path, child.route.stack)
    }
  }
}

recurse('/', assembly.webApp._router.stack)
