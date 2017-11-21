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

  get actionOpenCollectiveCommands() {
    return this.openCollectiveCommands
  }

  get outcomeAccountStore() {
    throw new Error('Override outcomeAccountStore')
  }
}