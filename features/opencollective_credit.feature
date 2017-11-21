@batch
Feature: OpenCollective Credit
  The application has a batch job that runs at regular intervals
  to update dollar balances for users that have donated money.

  Scenario: transactions are imported
    When the transactions in opencollective/transactions-2017-11-21.json are processed
    Then the opencollective-user-5560:USD balance should be 300

  Scenario: transactions are reimported
    When the transactions in opencollective/transactions-2017-11-21.json are processed
    And the transactions in opencollective/transactions-2017-11-21.json are processed
    Then the opencollective-user-5560:USD balance should be 300

  Scenario: @bob is credited 100 votes per dollar he paid
    Given the @bob:votes account exists
    And the opencollective-user-99:USD account exists
    And the opencollective-user-99:USD balance is 8
    When 3 is transferred from opencollective-user-99:USD to @bob:votes
    Then the @bob:votes balance should be 300
    And the opencollective-user-99:USD balance should be 5
