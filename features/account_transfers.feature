Feature: Account transfers
  Both people and issues have "bank" accounts with *votes* currency.
  Voting is done by transferring votes between *votes* accounts.

  In addition to *votes* accounts, people can also have *dollar* and *committer-days* accounts.
  They can transfer funds from their *dollar* and *committer-days* accounts at the current exchange rate.

  As such there are two ways to get voting power:
  * "Buy" votes by donating to the OpenCollective
  * "Earn" votes by being active on GitHub

  Background:
    Given the @bob:votes account exists
    And the #250:votes account exists
    And the @bob:dollars account exists

  Scenario: @bob votes 10 on #250
    Given the @bob:votes balance is 15
    And the #250:votes balance is 2
    When 10 is transferred from @bob:votes to #250:votes
    Then the #250:votes balance should be 12
    And the @bob:votes balance should be 5
