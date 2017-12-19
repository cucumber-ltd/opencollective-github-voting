Feature: GitHub Credit
  For each authenticated user we will maintain some accounts that can be transferred
  to votes later:

  * Number of commit-days in a repo
  * Number of days since they made their first commit in a repo

  Scenario: commit-days are imported

    In this example, bob is (obviously) only credited for
    his own commits (not sally's), and he doesn't get extra
    credit for being active in several repos on the same day.
    We only count unique days with commits.

    Given bob has a commit-days account with balance 10
    And the following commits have been made:
      | repo          | committer | timestamp  |
      | cucumber      | bob      | 2017-11-08 |
      | cucumber      | bob      | 2017-11-08 |
      | cucumber      | sally    | 2017-11-10 |
      | cucumber-jvm  | bob      | 2017-11-12 |
      | cucumber-ruby | bob      | 2017-11-12 |
      | experiment    | bob      | 2017-11-12 |
    # TODO: Change this to When bob authenticates?
    When commits are imported
    Then bob's commit-days balance should be 12