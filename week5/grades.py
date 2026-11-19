"""Letter-grade kata for the Week 5 pair-programming exercise."""

MIN_SCORE = 0
MAX_SCORE = 100
GRADE_THRESHOLDS = (
    (90, "A"),
    (80, "B"),
    (70, "C"),
    (60, "D"),
)


def letter_grade(score: int) -> str:
    """Convert an integer score from 0 through 100 into a letter grade."""
    if not MIN_SCORE <= score <= MAX_SCORE:
        raise ValueError("score must be between 0 and 100")

    for threshold, grade in GRADE_THRESHOLDS:
        if score >= threshold:
            return grade
    return "F"
