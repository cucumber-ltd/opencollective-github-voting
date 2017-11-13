Feature: Voting
  People can vote on certain issues
  People who have paid money to the collective have more voting power

  Background:
    Given @ryanwmarsh exists
    And cucumber/cucumber#250 exists

  Scenario: @ryanwmarsh votes 10 on cucumber/cucumber#250
    Given @ryanwmarsh has 15 votes
    Given cucumber/cucumber#250 has 2 votes
    When @ryanwmarsh votes 10 on cucumber/cucumber#250
    Then cucumber/cucumber#250 should have 12 votes
    And @ryanwmarsh should have 5 votes left