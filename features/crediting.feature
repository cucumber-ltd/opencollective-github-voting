Feature: Crediting

  Rules
  =====
  * One vote for each day since first commit to repo

  Background:
    Given the @bob:votes account exists
    Given the @bob:dollars account exists

  Scenario: @bob is credited 100 votes per dollar
    Given the @bob:votes balance is 123
    And the @bob:dollars balance is 2
    When 2 is transferred from @bob:dollars to @bob:votes
    Then the @bob:votes balance should be 323
