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
  get contextVotingPort() {
    return this.votingPort
  }

  get actionVotingPort() {
   throw new Error('Override')
  }

  get outcomeAccountStore() {
    throw new Error('Override')
  }
}