"""Refactored tuition-fee calculation from the Week 5 lab."""

from dataclasses import dataclass
from enum import Enum


HOURLY_FEE = 350
STAFF_CHILD_RATE = 0.5
LARGE_FEE_THRESHOLD = 6000
LARGE_FEE_REDUCTION = 200
SUMMER_SURCHARGE = 150


class StudentType(Enum):
    """Supported tuition categories."""

    REGULAR = 1
    STAFF_CHILD = 2
    SCHOLARSHIP = 3


@dataclass(frozen=True)
class Course:
    """A course and its credit/contact hours."""

    hours: int


def _coerce_student_type(student_type):
    """Accept the enum or the integer type codes used by the legacy data."""
    if isinstance(student_type, StudentType):
        return student_type
    try:
        return StudentType(student_type)
    except ValueError as error:
        raise ValueError("unsupported student type") from error


def tuition_fee(courses, student_type, summer=False, discount=0, extras=()):
    """Calculate tuition without printing; extras is immutable by default."""
    kind = _coerce_student_type(student_type)
    hourly_rate = {
        StudentType.REGULAR: HOURLY_FEE,
        StudentType.STAFF_CHILD: HOURLY_FEE * STAFF_CHILD_RATE,
        StudentType.SCHOLARSHIP: 0,
    }[kind]

    subtotal = sum(course.hours * hourly_rate for course in courses)
    if subtotal > LARGE_FEE_THRESHOLD:
        subtotal -= LARGE_FEE_REDUCTION
    if summer:
        subtotal += SUMMER_SURCHARGE
    if discount is not None:
        subtotal -= discount
    return subtotal + sum(extras)


def fee_report(name, amount):
    """Return a readable fee report instead of mixing calculation and printing."""
    lines = [f"{name}: {amount}"]
    if amount > LARGE_FEE_THRESHOLD:
        lines.append("High fee")
    return "\n".join(lines)


def process_all(students):
    """Return a mapping of each student's name to their calculated fee."""
    results = {}
    for student in students:
        results[student["name"]] = tuition_fee(
            student["courses"],
            student["type"],
            summer=student.get("summer", False),
            discount=student.get("discount", 0),
            extras=student.get("extras", ()),
        )
    return results
