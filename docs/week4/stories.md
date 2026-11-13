# User Stories - Sports Tournament Manager

Team Mavin (Group 2, Team 16) - Agile Software Engineering (SET 312)

## 1. Product vision
For faculty tournament organisers, team captains and spectators, the Sports
Tournament Manager replaces paper fixtures and disputed standings with
automatic round-robin fixtures, result entry and a live standings table.

## 2. Users
| Role | Description |
|------|-------------|
| Organiser | Runs the tournament: generates fixtures and enters results |
| Team Captain | Registers the team and its players |
| Spectator | Views fixtures, results and the standings (no login needed) |

## 3. Key business rules
- Round-robin: every team plays every other team exactly once.
- Win = 3 points, draw = 1 point, loss = 0 points.
- Ties in the standings are broken by: (1) goal difference, (2) goals scored, (3) head-to-head result.
- Test data only: no real student records.

## 4. Technical assumptions
- The MVP has no authentication. Captain, Organiser and Spectator are separate views. Real login is the stretch story US-16.
- Data is stored in a small database (for example SQLite) or a JSON file, with test data only.
- The business rules live in plain functions with no UI code, so they can be unit tested and described in Gherkin:
  - `generateFixtures(teams)` returns the rounds and matches
  - `calculateStandings(teams, matches)` returns the ranked table
  - `compareTeams(a, b, matches)` applies the tie-break order
- Standings are computed from the stored match results, not stored separately.

| Entity | Main fields |
|--------|-------------|
| Team | id, name |
| Player | id, teamId, name, shirtNumber |
| Match | id, round, homeTeamId, awayTeamId, homeGoals, awayGoals, status |

## 5. Epics
| Epic | Scope |
|------|-------|
| E1 Team and Player Registration | MVP |
| E2 Fixture Generation | MVP |
| E3 Match Results | MVP |
| E4 Live Standings | MVP |
| E5 Stretch Features | Stretch (below the MVP line) |

## 6. Backlog (in priority order)

Story points are assigned in estimation.md after Planning Poker.

---

### E1 - Team and Player Registration (MVP)

**US-01 Register a team**
As a team captain, I want to register my team with a name so that it takes part in the tournament.
- Given the registration form, when I enter a unique team name and submit, then the team is saved and shown in the team list.
- A team name cannot be empty.
- A duplicate team name is rejected with a clear error message.

**US-02 Add players to a team**
As a team captain, I want to add players to my team so that the organiser knows who is playing.
- I can add a player with a name and a shirt number.
- A shirt number cannot be used twice within the same team.
- The player appears in my team's player list after saving.

**US-03 Edit or remove a player**
As a team captain, I want to edit or remove a player so that my squad list is correct.
- I can change a player's name or shirt number.
- I can remove a player from my team.
- Changes are blocked once fixtures have been generated, with a message explaining why.

**US-04 View registered teams**
As an organiser, I want to see all registered teams and their players so that I can check the tournament is ready.
- The list shows every team with its number of players.
- I can open a team to see its players.
- The list shows a message when no team is registered yet.

---

### E2 - Fixture Generation (MVP)

**US-05 Generate round-robin fixtures**
As an organiser, I want fixtures generated automatically so that every team plays every other team once.
- Given N registered teams, when I click Generate, then exactly N x (N-1) / 2 matches are created.
- No team is scheduled against itself and no pair meets twice.
- Matches are split into rounds. With an odd number of teams, one team rests ("bye") in each round.
- Generated matches start with the status "scheduled".

**US-06 Block invalid fixture generation**
As an organiser, I want the system to stop me from generating fixtures in invalid situations so that I never get a broken schedule.
- With fewer than 2 teams, generation is blocked with a clear error message.
- If fixtures exist and no result has been entered, generating again asks for confirmation and then replaces them.
- If any result has been entered, regeneration is blocked with a clear error message.

**US-07 View fixtures by round**
As a spectator, I want to see the fixture list grouped by round so that I know who plays when.
- Matches are grouped and labelled by round number.
- Each match shows both team names and its status (scheduled or played).
- The page works without logging in.

---

### E3 - Match Results (MVP)

**US-08 Enter a match result**
As an organiser, I want to enter the score of a match so that the standings can be updated.
- I select a scheduled match and enter a goal count for each team.
- After saving, the match status changes to "played".
- The result is shown in the fixture list.

**US-09 Validate match results**
As an organiser, I want invalid scores rejected so that wrong data never reaches the standings.
- Negative scores are rejected.
- Non-numeric scores are rejected.
- Only matches that exist and are not yet played can receive a first result.

**US-10 Correct a wrong result**
As an organiser, I want to correct a result I entered by mistake so that the standings stay accurate.
- I can edit the score of a played match.
- The standings are recalculated after the correction.
- The match keeps its place in the fixture list.

---

### E4 - Live Standings (MVP)

**US-11 View the standings table**
As a spectator, I want to see the standings table so that I know which teams are leading.
- The table shows played, won, drawn, lost, goals for, goals against, goal difference and points per team.
- The table updates as soon as a result is saved.
- The page works without logging in.

**US-12 Calculate points correctly**
As a spectator, I want points calculated by the official rule so that the table is trustworthy.
- A win gives 3 points, a draw gives 1 point and a loss gives 0 points.
- Teams that have not played show 0 in every column.
- Standings are calculated from the saved match results, so correcting a result changes the table.

**US-13 Break ties by goal difference and goals scored**
As a spectator, I want teams with equal points ranked fairly so that the order is not disputed.
- Teams with equal points are ordered by goal difference first.
- If goal difference is also equal, they are ordered by goals scored.
- Each rule is covered by a unit test with an examples table.

**US-14 Break ties by head-to-head**
As a spectator, I want a final head-to-head tie-breaker so that two teams equal on everything else are still ranked.
- If exactly two teams are equal on points, goal difference and goals scored, the winner of their match ranks higher.
- If that match was a draw, or if three or more teams are still equal, they share the same rank.
- This rule is described in a Gherkin Scenario Outline with an examples table.

**US-15 View upcoming and past matches**
As a spectator, I want to filter matches by played and upcoming so that I can find what I care about quickly.
- I can switch between "Upcoming" and "Played".
- Played matches show the final score.
- Upcoming matches show only the two team names.

---

### E5 - Stretch Features (below the MVP line)

**US-16 Organiser login**
As an organiser, I want to log in so that only I can generate fixtures and enter results.
- Generating fixtures and entering results require a logged-in organiser.
- Spectators can still view everything without logging in.
- A wrong password shows an error message and does not log me in.

**US-17 Top scorers**
As a spectator, I want to see the top scorers so that I can follow the best players.
- The organiser can record goal scorers per match.
- A top-scorers list is ordered by goals.
- Players with equal goals share the same rank.

**US-18 Knock-out stage**
As an organiser, I want a knock-out stage after the group stage so that the tournament has a final.
- The top 4 teams from the standings advance to the semi-finals.
- Semi-final winners play a final.
- A knock-out match cannot end in a draw.

---

## 7. MVP line
Stories **US-01 to US-15** are the MVP, covering the four required epics (E1 to E4).
Stories **US-16 to US-18** are stretch and are only started if the MVP is finished.

## 8. Notes for the Product Owner
- Priority order above is a draft for the PO to confirm or change.
- Large stories may be split during estimation (for example US-13 and US-14).
- Acceptance criteria will be turned into Gherkin scenarios in Sprint 2.