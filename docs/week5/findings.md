# Week 5 - Findings (Part C)

Pair: Martin Milad (did the lab) and Kirolos Ayman Abdelmalk (reviewed the pull request)
File analysed: `week5/legacy_fees.py` (kept unchanged)
Raw tool output: `docs/week5/before.txt`

## 1. Findings table

Ruff version used: ruff 0.17.6. Total problems found: 17.
The handout lists 16 problems. Newer Ruff versions also report PLR0917 (too many positional arguments), which gives 17. The table below matches our own run in `before.txt`.

| Rule | Count | Smell (lecture name) | Refactoring |
|------|-------|----------------------|-------------|
| F401 | 2 | Dead code (unused imports) | Delete the imports |
| PLR2004 | 6 | Magic numbers | Replace with named constants / an enum |
| C901 | 1 | Long method / complex conditional (`calc` has complexity 9, limit 5) | Replace the `if/elif` chain with a rate table (lookup) and extract small steps |
| PLR0913 | 1 | Long parameter list (6 parameters) | Remove unused parameters, use defaults, introduce a parameter object (`Course`) |
| PLR0917 | 1 | Long parameter list (too many positional arguments; only in newer Ruff) | Same as PLR0913 |
| ARG001 | 1 | Dead code (unused parameter `y`) | Remove the parameter |
| B006 | 1 | Mutable default argument (`extra=[]` is shared between calls) | Use an immutable default `extras=()` or `None` |
| E711 / E712 | 1 / 1 | Unidiomatic comparison with `None` / `True` | Use `if summer:` and a default of `0` for the discount |
| F841 | 1 | Dead code (unused variable `tmp`) | Delete the variable |
| N802 | 1 | Bad naming (`ProcessAll` is not snake_case) | Rename to `process_all` |

## 2. Smells the tools did not report

1. **Mysterious names:** `d`, `t`, `y`, `s`, `disc`, `c`, `x`, `st` say nothing about what they hold.
2. **Type code instead of a type:** the numbers 1/2/3 for the student type need a comment to be understood. An `Enum` makes them self-explaining.
3. **Duplicated code:** `ProcessAll` has two almost identical `calc(...)` calls that differ only in the type number.
4. **Mixed responsibilities:** `report` and `ProcessAll` calculate and also print, so they cannot be tested without capturing the console output.
5. **Primitive obsession:** a course is a dictionary with a cryptic key `"h"` instead of a small `Course` class.

## 3. The hidden bug in `ProcessAll`

`fee` is only set when the type is 1 or 2, so for a scholarship student (type 3) neither `if` runs. Omar is therefore printed with the value left over from the previous student (Sara's 1050) instead of 0, so he is effectively skipped and reported with someone else's fee. If Omar is first in the list, `fee` was never set and Python raises `UnboundLocalError` (we checked this in the Python shell).
