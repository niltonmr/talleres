Feature: Deducible Management

  Scenario: ES001 Get deducible from text
    Given a deducible text "sample text"
    When I request to get the deducible
    Then the deducible should be processed