Feature: OpenCollective Credit
  The application has a batch job that runs at regular intervals
  to update dollar balances for users that have donated money.

  @batch
  Scenario: transactions are imported
    When the transactions in opencollective/transactions-2017-11-21.json are processed
    Then the opencollective-user-5560:USD balance should be 300

  @batch
  Scenario: transactions are reimported
    When the transactions in opencollective/transactions-2017-11-21.json are processed
    And the transactions in opencollective/transactions-2017-11-21.json are processed
    Then the opencollective-user-5560:USD balance should be 300
