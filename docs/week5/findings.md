# Week 5 — Static-analysis findings

## Scope

The analysis target is the `legacy_fees.py` supplied by the Lab 5 handout. The
table below records the handout's reference counts alongside your actual Ruff
findings so they can be verified against `docs/week5/before.txt` before
submission.

| Ruff rule | Handout count | Code smell | Refactoring |
|---|---:|---|---|
| F401 | 2 | Dead code: unused imports (`os`, `math`) | Remove unused imports |
| PLR2004 | 6 | Magic numbers | Replace literals with named constants or an enum |
| C901 | 1 | Excessive complexity | Decompose logic and replace branching with a rate table |
| PLR0913 | 1 | Too many function arguments | Group related data and simplify the function interface |
| PLR0917 | 0 (in handout) | Too many positional arguments (6 > 5) | Reduce positional parameters or group inputs |
| ARG001 | 1 | Unused function argument | Remove or handle the unused `y` argument |
| B006 | 1 | Mutable default argument | Replace `extra=[]` with `None` / immutable `extras=()` |
| E711 / E712 | 1 each | Non-idiomatic comparisons with `None` and `True` | Use `is not None` and direct truth testing |
| F841 | 1 | Unused local variable | Remove unused `tmp` |
| N802 | 1 | Invalid function naming | Rename `ProcessAll` to `process_all` |

**Verification note:** The handout's reference lists 16 Ruff findings, while a
full Ruff run in the first turn reported 17 findings including `PLR0917`. Paste
the actual `python -m ruff check legacy_fees.py`,
`python -m ruff check legacy_fees.py --statistics`, and
`python -m pylint legacy_fees.py` outputs into `docs/week5/before.txt` and
confirm the exact count on `legacy_fees.py`.

## Additional smells Ruff does not report

1. **Mysterious names:** Parameters such as `d`, `t`, `y`, `s`, and `disc` hide
the meaning of the data. Use descriptive names such as `courses`, `student_type`,
`summer`, and `discount`.
2. **Duplicated logic:** `ProcessAll` repeats almost the same fee-calculation
call for multiple student types. A single call using the student's type removes
the duplication.
3. **Mixed responsibilities:** Reporting/fee handling mixes calculation and
output formatting (`print`). Keep calculation separate from presentation; return
report text from a formatting function instead.
4. **Primitive obsession:** Student categories are represented by unexplained
integer codes and course hours by dictionaries such as `{"h": 3}`. Use an enum
and a small `Course` data class.

## Hidden bug in `ProcessAll`

The function only assigns `fee` for student types 1 and 2; it has no branch for
scholarship type 3. If a scholarship student follows a regular or staff-child
student, Python reuses the previous loop iteration's `fee`, so Omar incorrectly
receives Sara's 1050 fee in the handout example. If a scholarship student is the
first item, `fee` has never been assigned and Python raises `UnboundLocalError`.
The refactored `process_all` calculates a result for every supported student
type, including scholarship students whose tuition rate is zero.

## Evidence still required

- Paste real Ruff and Pylint output into `docs/week5/before.txt`.
- Confirm the rule counts in this file against `docs/week5/before.txt` before final submission.