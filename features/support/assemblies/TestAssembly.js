const AppAssembly = require('../../../lib/AppAssembly')

/**
 * Base class for test assemblies
 *
 * @type {module.TestAssembly}
 */
module.exports = class TestAssembly extends AppAssembly {
  /**
   * The port to use in Given steps. Don't override this method.
   */
  get contextAccountCommands() {
    return this.accountCommands
  }

  get actionTransferCommands() {
    throw new Error('Override actionTransferCommands')
  }

  get actionUserCommands() {
    throw new Error('Override actionUserCommands')
  }

  get outcomeAccountQueries() {
    throw new Error('Override outcomeAccountQueries')
  }

  get outcomeUserQueries() {
    throw new Error('Override outcomeUserQueries')
  }
}