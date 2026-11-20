# Week 5 - After refactoring (Part D)

Pair: Martin Milad (driver) and Kirolos Ayman Abdelmalk (navigator)
File analysed: `week5/legacy_fees.py` (kept unchanged)
Raw tool output: `docs/week5/before.txt`

## 1. Before / after

| Measure | Before (`legacy_fees.py`) | After (`fees.py`) |
|---------|---------------------------|-------------------|
| Ruff issues (total) | 17 | 0 |
| Highest cyclomatic complexity | 9 (`calc`) | 3 (`tuition_fee`) |
| Arguments of the main function | 6 | 5 (`tuition_fee`: courses, student_type, summer, discount, extras), with 3 of them optional |
| Pylint score (/10) | 4.86 | 10.00 |
| Tests passing | 0 (no tests) | 16 passed |

Notes:
- `ruff check .` still reports the problems in `legacy_fees.py`, because the handout tells us to keep the old file unchanged so the characterization tests can compare old and new. For the new code we ran `ruff check . --extend-exclude legacy_fees.py`, which gave: `All checks passed!`. The full output of the final commands is in `after-output.txt`.
- `test_fees.py` was written before step 1. It could not run until step 5, because it uses the new names `Course` and `StudentType`. From step 5 on, all tests passed except `test_scholarship_student_is_not_skipped`, which failed as expected until the bug fix in step 7.

## 2. Refactoring steps (one commit each)

| # | Step | Removed |
|---|------|---------|
| 1 | Deleted unused imports, variable `tmp` and argument `y` | F401, F841, ARG001 |
| 2 | Renamed `calc` to `tuition_fee`, `d` to `courses`, `s` to `summer`, `ProcessAll` to `process_all` | N802, mysterious names |
| 3 | Constants for the numbers and a `StudentType` Enum for 1/2/3 | PLR2004, type-code comment |
| 4 | Rate table instead of the `if/elif` chain; `if summer:`; discount default 0 | C901, E711, E712 |
| 5 | `extras=()` and a `Course` data class | B006, primitive obsession |
| 6 | `report` returns text; `process_all` returns a dictionary | Mixed responsibilities |
| 7 | Every student gets a fee, including scholarship students | Hidden bug from Part C |

## 3. Reflection (3-4 sentences)

WWe could not meet in person, so we paired remotely: Martin drove on his laptop and shared his screen, while Kirolos navigated on a voice call, checking each command and test result before we moved on. The characterization tests made each refactoring step feel safe, because we could see right away whether the behaviour changed, and running the legacy code ourselves showed us the hidden scholarship bug that Ruff did not report. The main difficulty was that only one of us typed, so we did not swap the driver and navigator roles as the lab intended. Next time we would swap the driver every block using push and pull, so both of us get practice in both roles.

## 4. One line each

- Martin Milad (did the lab): Writing the characterization tests before refactoring showed me straight away whether a change broke anything, and the hidden scholarship bug taught me that a clean linter report does not mean the code is correct.
- Kirolos Ayman Abdelmalk (reviewer): <ONE SENTENCE FROM KIROLOS ABOUT WHAT THEY CHECKED IN THE REVIEW>
