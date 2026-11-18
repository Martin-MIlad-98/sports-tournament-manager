# Forecast - Sports Tournament Manager

Team Mavin (Group 2, Team 16) - Agile Software Engineering (SET 312)

## 1. Assumed velocity
Velocity is the number of story points the team finishes in one one-week Sprint.

**Assumed velocity: 15 points per Sprint.**

Reasons:
- We have no past Sprints yet, so this is an assumption that we will replace with the real number after Sprint 1.
- The team has 4 developers, working part-time next to other courses.
- Many MVP stories are small (2 to 3 points) and use the same pattern: a form, a rule and a list.
- Sprint 1 has extra setup work (CI pipeline, project skeleton), so it is planned a little below 15.

## 2. Totals (from `estimation.md`)

| Scope | Points |
|-------|--------|
| MVP (US-01 to US-15) | 44 |
| Stretch (US-16 to US-18) | 18 |
| Whole backlog | 62 |

## 3. Calculation
MVP points / velocity = 44 / 15 = 2.9, which rounds up to **3 Sprints**.

The brief requires all MVP stories to be done by the end of Sprint 3 (Week 10). The MVP fits, but with almost no spare capacity, so Sprint 4 is kept as a buffer.

## 4. Sprint plan

| Sprint | Week | Goal | Stories | Points |
|--------|------|------|---------|--------|
| Sprint 1 | 8 | Walking skeleton: one thin end-to-end slice per member, and CI running | US-01 (2), US-05 (5), US-08 (3), US-11 (3) | 13 |
| Sprint 2 | 9 | Complete registration, fixtures and result validation, and deploy | US-02 (3), US-03 (3), US-04 (2), US-06 (3), US-07 (2), US-09 (2) | 15 |
| Sprint 3 | 10 | Finish the MVP and collect user feedback | US-10 (3), US-12 (3), US-13 (3), US-14 (5), US-15 (2) | 16 |
| Sprint 4 | 11 | Improve from feedback, stretch if there is capacity | Fixes from feedback, US-16 (5) if time allows | up to 15 |

Average planned load for the MVP: (13 + 15 + 16) / 3 = 14.7 points per Sprint.

Notes:
- In Sprint 1, US-11 shows a simple standings table. The full rules arrive with US-12 and US-13 in Sprint 3.
- Each member takes one story in Sprint 1 (US-01, US-05, US-08, US-11), so everyone has merged code and tests in their name early.

## 5. Risks and assumptions
- **Tie-break logic (US-13, US-14)** may take longer than estimated because of the many edge cases. Mitigation: write the unit tests first (TDD) and keep the rules in plain functions.
- **Fixture generation (US-05)** with an odd number of teams (bye) is the biggest single story at 5 points. Mitigation: start it in Sprint 1 so there is time to adjust.
- **First Sprint overhead:** setting up the stack, CI pipeline and test tools may use more time than planned. Sprint 1 is therefore planned at 13 points, below the assumed velocity.
- **Exams and other deadlines** can reduce capacity in any week. If a Sprint falls short, stories from the end of Sprint 3 move to Sprint 4.
- **Velocity is an assumption.** After Sprint 1 we compare the real completed points with 15 and update this forecast.
- Stretch stories are dropped first if we are late.
- US-18 (8 points) is split before it is scheduled, as described in `estimation.md`.
