@batch @wip
Feature: GitHub Credit
  For each authenticated user we will maintain some accounts that can be transferred
  to votes later:

  * Number of committer-days in a repo
  * Number of days since they made their first commit in a repo

  Scenario: committer-days are imported
    Given the following commits have been made:
      | repo          | committer     | timestamp  |
      | cucumber      | aslakhellesoy | 2017-11-08 |
      | cucumber      | aslakhellesoy | 2017-11-08 |
      | cucumber      | aslakhellesoy | 2017-11-10 |
      | cucumber-jvm  | aslakhellesoy | 2017-11-12 |
      | cucumber-ruby | aslakhellesoy | 2017-11-12 |
      | experiment    | aslakhellesoy | 2017-11-12 |
    And the aslakhellesoy:commit-days account exists
    When the aslakhellesoy:commit-days balance is updated
    Then the aslakhellesoy:commit-days balance should be 4