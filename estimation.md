# Estimation - Sports Tournament Manager

Team Mavin (Group 2, Team 16) - Agile Software Engineering (SET 312)

## 1. Method
We used relative sizing with story points. Every story was compared with one reference story, so the numbers show how big and how uncertain a story is compared with the others, not how many hours it takes.

A first set of estimates was prepared by Martin and then reviewed by all four team members before it was adopted. The reviewed numbers are the ones in this file, in Jira and in `forecast.md`.

## 2. Scale
Modified Fibonacci: 1, 2, 3, 5, 8.
A story of 8 points is too big to schedule as it is and is split before it enters a Sprint.

## 3. Reference story
**US-01 Register a team = 2 points.**
It is a simple form with two validations (empty name, duplicate name) and a saved list. Everything else is compared with it:
- Same size or smaller: 1 to 2 points
- A bit more logic, validation or screens: 3 points
- Real algorithm or several rules working together: 5 points
- Large, several parts, high uncertainty: 8 points

## 4. Estimates

| ID | Story | Points | Reasoning |
|----|-------|--------|-----------|
| US-01 | Register a team | 2 | Reference story: simple form, empty and duplicate name checks |
| US-02 | Add players to a team | 3 | Like US-01, plus the rule that a shirt number is unique within a team and a player list per team |
| US-03 | Edit or remove a player | 3 | Edit and delete, plus a block once fixtures exist, which needs a check against the fixture state |
| US-04 | View registered teams | 2 | Read-only list with player counts and a team detail view |
| US-05 | Generate round-robin fixtures | 5 | Core algorithm: N x (N-1) / 2 matches, rounds, and a bye when the number of teams is odd. Needs careful tests |
| US-06 | Block invalid fixture generation | 3 | Three rules (fewer than 2 teams, confirm and replace, block if results exist) around the generator |
| US-07 | View fixtures by round | 2 | Read-only page grouped by round, with status |
| US-08 | Enter a match result | 3 | Form, saving the score and changing the match status to played |
| US-09 | Validate match results | 2 | Input checks (negative, non-numeric, already played) on the existing form |
| US-10 | Correct a wrong result | 3 | Edit a saved result and make sure the standings recalculate |
| US-11 | View the standings table | 3 | Table with 8 columns that updates when a result is saved |
| US-12 | Calculate points correctly | 3 | Pure function: 3/1/0 points, goals, and empty teams. Easy to unit test, but it is the core rule |
| US-13 | Break ties by goal difference and goals scored | 3 | Multi-level sort, covered by a unit test with an examples table |
| US-14 | Break ties by head-to-head | 5 | Needs the match between the two teams, and a defined result when 3 or more teams are still equal |
| US-15 | View upcoming and past matches | 2 | Filter on status over data that already exists |
| US-16 | Organiser login (stretch) | 5 | Authentication, protected actions and error handling |
| US-17 | Top scorers (stretch) | 5 | Needs goal scorers per match, which changes the result form and the data model |
| US-18 | Knock-out stage (stretch) | 8 | New stage, seeding from the standings, semi-finals, a final, and no draws. See section 6 |

## 5. Disagreements
No disagreements were recorded during the team review.

## 6. Split stories
No story was split in the MVP.

US-18 is estimated at 8 points. It is a stretch story and will not be scheduled in a Sprint as it is. If the team decides to start it, it will first be split into two stories, a semi-finals stage and a final, and both will be re-estimated.

## 7. Totals

| Epic | Stories | Points |
|------|---------|--------|
| E1 Team and Player Registration | US-01 to US-04 | 10 |
| E2 Fixture Generation | US-05 to US-07 | 10 |
| E3 Match Results | US-08 to US-10 | 8 |
| E4 Live Standings | US-11 to US-15 | 16 |
| **MVP total** | **US-01 to US-15** | **44** |
| E5 Stretch Features | US-16 to US-18 | 18 |
| **Whole backlog** | **US-01 to US-18** | **62** |

These points are the same as the "Story point estimate" field in Jira and the numbers used in `forecast.md`.
