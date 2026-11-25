# Sports Tournament Manager

Agile Software Engineering (SET 312) - Group 2 Team Project

## Product vision
For faculty tournament organisers, team captains and spectators, the Sports
Tournament Manager replaces paper fixtures and disputed standings with
automatic round-robin fixtures, result entry and a live standings table.

**Stack:** HTML + CSS + vanilla JavaScript (frontend) · Node.js + Express (small server) · JSON file as the database.
Test data only: no real student records.

## Team
Team Mavin (Group 2, Team 16)

| Name | GitHub | Role (Sprints 0-2) |
|------|--------|--------------------|
| Nour Romany | nourromany05-dev | Product Owner |
| Andrew Sela | Andrew-Sela | Scrum Master |
| Kirolos Ayman Abdelmalk | kiro-ayman | Developer |
| Martin Milad | Martin-MIlad-98 | Developer |

## How to install, run and test

Requires **Node.js 20 or newer**.

```bash
npm install
npm start
```

Open http://localhost:3000. The first start creates `data/db.json` from `data/seed.json` (4 fake teams).

| Command | What it does |
|---|---|
| `npm start` | Start the server on port 3000 (PowerShell: `$env:PORT=4000; npm start` to change it) |
| `npm run dev` | Start with auto-restart on file changes |
| `npm test` | Run all tests (Node's built-in test runner) |
| `npm run lint` | Run ESLint |
| `npm run seed` | Reset `data/db.json` to the seed data |

## Pages (no login in the MVP)

| Page | Role | Purpose |
|---|---|---|
| `/` | everyone | Overview and quick stats |
| `/teams.html` | Team Captain | Register a team |
| `/organiser.html` | Organiser | Generate fixtures, enter results |
| `/fixtures.html` | Spectator | Fixtures grouped by round |
| `/standings.html` | Spectator | Live standings table |

## API

| Method | Path | Story |
|---|---|---|
| GET | `/api/teams` | US-01 |
| POST | `/api/teams` `{ name }` | US-01 |
| GET | `/api/fixtures` | US-05 |
| POST | `/api/fixtures/generate` | US-05 |
| PUT | `/api/matches/:id/result` `{ homeGoals, awayGoals }` | US-08 |
| GET | `/api/standings` | US-11 |

Errors are JSON: `{ "error": "message" }` with status 400 (invalid input), 404 (not found) or 409 (conflict).

## Project structure

```
src/logic/     business rules as pure functions (no I/O) -> unit tested (TDD)
src/repo/      reads/writes the JSON database
src/routes/    one file per story; loaded automatically by src/app.js
src/store/     the JSON file store (queued, atomic writes)
public/        the frontend (HTML, CSS, JS modules)
tests/         unit tests + API test (node:test)
features/      Gherkin scenarios + steps (Sprint 2)
docs/project/  vision, Definition of Done, sprint plans, reviews, retros and feedback
data/seed.json test data; data/db.json is created locally and is git-ignored
```

## Business rules

- Round-robin: every team plays every other team exactly once (N x (N-1) / 2 matches). With an odd number of teams one team rests each round.
- Win = 3 points, draw = 1, loss = 0.
- Tie-breaks (goal difference, goals scored, head-to-head) arrive in Sprint 3.
- Standings are always calculated from the saved match results, never stored.

## Conventions
- Branch names: `feature/SPORT-14-us-05-fixtures`, `chore/skeleton`, `docs/short-description`
- Commit messages: `SPORT-14: short description` (the Jira issue key first)
- Never commit directly to `main`; open a pull request and get one review
- Merge pull requests with "Create a merge commit" so the small commits stay in the history

## Sprint status

Sprint 1 (walking skeleton): US-01 register a team, US-05 generate fixtures, US-08 enter a result, US-11 standings table.

## Contributors
- Martin Milad
- Nour Romany
- kirolols ayman
- Andrew Sela

## Links
- Jira board: (add link after creating Jira)