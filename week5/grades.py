"""Convert a numeric score into a letter grade."""

MIN_SCORE = 0
MAX_SCORE = 100
FAIL_GRADE = "F"

# (lowest score for the grade, letter), checked from the top down
GRADE_BOUNDARIES = (
    (90, "A"),
    (80, "B"),
    (70, "C"),
    (60, "D"),
)


def letter_grade(score):
    """Return the letter grade for a score from 0 to 100."""
    if score < MIN_SCORE or score > MAX_SCORE:
        raise ValueError(f"score must be between {MIN_SCORE} and {MAX_SCORE}")
    for lowest, letter in GRADE_BOUNDARIES:
        if score >= lowest:
            return letter
    return FAIL_GRADE
