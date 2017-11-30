Feature: Signup

  After a user signs up, two accounts are created for them:
  * A `votes` account (with initial "welcome" balance 10)
  * A `commit-days` account (with initial balance 0)

  The `commit-days` account is credited later, when commit days
  are imported.

  We're not creating a USD account on signup - that account will
  be created later, when OpenCollective transactions are imported.

  Scenario: @bob gets 2 empty accounts when he signs up
    When @bob signs up
    Then @bob's statement should be:
      | number           | currency    | balance |
      | @bob-votes       | votes       |      10 |
      | @bob-commit-days | commit-days |       0 |
