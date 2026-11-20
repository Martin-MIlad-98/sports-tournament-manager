"""Tuition fee calculation for the Student Services App (refactored)."""

from dataclasses import dataclass
from enum import Enum

RATE_PER_HOUR = 350
HIGH_FEE_LIMIT = 6000
HIGH_FEE_REDUCTION = 200
SUMMER_FEE = 150


class StudentType(Enum):
    """The kinds of student, each with its own share of the hourly rate."""

    REGULAR = 1
    STAFF_CHILD = 2
    SCHOLARSHIP = 3


@dataclass(frozen=True)
class Course:
    """A course the student is registered in."""

    hours: int


# Share of the full hourly rate that each type of student pays
RATE_SHARE = {
    StudentType.REGULAR: 1,
    StudentType.STAFF_CHILD: 0.5,
    StudentType.SCHOLARSHIP: 0,
}

LABELS = {
    StudentType.REGULAR: "Student fee",
    StudentType.STAFF_CHILD: "Staff child fee",
    StudentType.SCHOLARSHIP: "Scholarship fee",
}


def tuition_fee(courses, student_type, summer=False, discount=0, extras=()):
    """Return the tuition fee for one student."""
    hours = sum(course.hours for course in courses)
    total = hours * RATE_PER_HOUR * RATE_SHARE[student_type]
    if total > HIGH_FEE_LIMIT:
        total -= HIGH_FEE_REDUCTION
    if summer:
        total += SUMMER_FEE
    total -= discount
    total += sum(extras)
    return total


def report(courses, student_type, summer=False, discount=0):
    """Return the fee report for one student as text (no printing)."""
    fee = tuition_fee(courses, student_type, summer, discount)
    lines = [f"{LABELS[student_type]}: {fee}"]
    if fee > HIGH_FEE_LIMIT:
        lines.append("High fee")
    return "\n".join(lines)


def process_all(students):
    """Return a {name: fee} dictionary with a fee for every student."""
    return {
        student["name"]: tuition_fee(
            student["courses"], student["type"], student["summer"]
        )
        for student in students
    }
