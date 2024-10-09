To generate the .feature files with Gherkin formatting for the test cases and automate the tests, follow these steps:

1. **Generate .feature file**

Create a new file named `conduit_login_and_article_manipulation.feature` and structure it using the Gherkin format:

```feature
# Feature: Core Conduit functionalities

@sanity
Feature: Conduit login and article manipulation

  Scenario: Successful login
    Given a user profile with email "testAPI@test.com" and password "welcome123"
    When they navigate to the Conduit login page 
    And they enter their email and password
    And they click the "Log In" button
    Then they should be redirected to the home page 

  Scenario: Incorrect login credentials
    Given a user profile with email "invalid@test.com" and password "incorrect"
    When they navigate to the Conduit login page 
    And they enter their email and password
    And they click the "Log In" button
    Then they should stay on the login page and see an error message for invalid credentials

  Scenario: Successful article creation
    Given a logged-in user
    When they navigate to the "Write" page
    And they fill in the "Title" field with "Test Article"
