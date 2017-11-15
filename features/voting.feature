Feature: Voting
  People can vote on certain issues
  People who have paid money to the collective have more voting power

  Background:
    Given the @bob:votes account exists
    And the #250:votes account exists

  Scenario: @bob votes 10 on #250
    Given the @bob:votes balance is 15
    And the #250:votes balance is 2
    When 10 is transferred from @bob:votes to #250:votes
    Then the #250:votes balance should be 12
    And the @bob:votes balance should be 5