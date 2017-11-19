const Assembly = require('../../../lib/Assembly')

/**
 * Base class for test assemblies
 *
 * @type {module.TestAssembly}
 */
module.exports = class TestAssembly extends Assembly {
  /**
   * The port to use in Given steps. Don't override this method.
   */
  get contextVotingPort() {
    return this.votingPort
  }
}