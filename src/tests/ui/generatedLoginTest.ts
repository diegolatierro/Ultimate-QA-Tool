Scenario: Successful Login
  Given the user navigates to the login page
  When the user enters a valid email and password
  And the user clicks on the login button
  Then the user should be redirected to the dashboard

Scenario: Failed Login with Invalid Credentials
  Given the user navigates to the login page
  When the user enters an invalid email and password
  And the user clicks on the login button
  Then the user should see an error message "Invalid email or password"