const AppAssembly = require('../../../lib/AppAssembly')
const SimulatedCommitsBalanceProvider = require('../../../test_support/SimulatedCommitsBalanceProvider')

/**
 * Base class for test assemblies
 */
module.exports = class TestAssembly extends AppAssembly {
  constructor() {
    const simulatedCommitDaysBalanceProvider = new SimulatedCommitsBalanceProvider()
    super({ commitDaysBalanceProvider: simulatedCommitDaysBalanceProvider })
    this.simulatedCommitDaysBalanceProvider = simulatedCommitDaysBalanceProvider
  }

  // The ports to use in Given steps. Don't override these methods.

  get contextAccountCommands() {
    return this.accountCommands
  }

  get actionTransferCommands() {
    throw new Error('Override actionTransferCommands')
  }

  get outcomeAccountStore() {
    throw new Error('Override outcomeAccountStore')
  }
}