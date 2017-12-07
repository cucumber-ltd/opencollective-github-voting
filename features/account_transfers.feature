Feature: Account transfers
  Both people and issues are account holders.
  Each account holder can hold several accounts, each with a different currency:

  * USD
  * votes

  People also hold accounts in the following currencies, which can be exchanged for votes
  (at a variable exchange rate):

  * commit-days
  * closed-issues

  Voting on an issue is done by transferring funds from a person's account to an issue's account (in the same currency).

  There are two ways to get voting power:
  * "Buy" USD votes by donating to the OpenCollective
  * "Earn" votes by being active on GitHub

  Scenario: @bob votes 10 on #250
    Given @bob has a votes account with balance 15
    And #250 has a votes account with balance 2
    When @bob transfers 10 votes to #250
    Then #250's votes balance should be 12
    And @bob's votes balance should be 5
