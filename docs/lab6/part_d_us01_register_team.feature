Feature: Register a team 
 
  Scenario: Register a team with a unique name 
    Given the registration form is open 
    When I enter team name "Team Mavin" and submit 
    Then the team "Team Mavin" is saved and shown in the team list 
 
  Scenario: Refuse a duplicate team name 
    Given a team named "Team Mavin" already exists 
    When I try to register a team with name "Team Mavin" 
    Then registration is refused with error "Team name already exists" 
    And no duplicate team named "Team Mavin" is added 
 
  Scenario Outline: Validate team name input 
    Given the registration form is open 
    When I enter team name "<name>" and submit 
    Then the result is "<outcome>" 
 
    Examples: 
      | name       | outcome                      | 
      | Lions FC   | team saved and shown         | 
      |            | refused: name cannot be empty  | 
      | Team Mavin | refused: duplicate team name | 
