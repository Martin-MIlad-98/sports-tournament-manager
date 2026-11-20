from dataclasses import dataclass
from enum import Enum

RATE_PER_HOUR = 350
HIGH_FEE_LIMIT = 6000
HIGH_FEE_REDUCTION = 200
SUMMER_FEE = 150


class StudentType(Enum):
    REGULAR = 1
    STAFF_CHILD = 2
    SCHOLARSHIP = 3


@dataclass(frozen=True)
class Course:
    hours: int


# Share of the full hourly rate that each type of student pays
RATE_SHARE = {
    StudentType.REGULAR: 1,
    StudentType.STAFF_CHILD: 0.5,
    StudentType.SCHOLARSHIP: 0,
}


def tuition_fee(courses, student_type, summer=False, discount=0, extras=()):
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
    fee = tuition_fee(courses, student_type, summer, discount)
    if student_type == StudentType.REGULAR:
        print("Student fee: " + str(fee))
    elif student_type == StudentType.STAFF_CHILD:
        print("Staff child fee: " + str(fee))
    if fee > HIGH_FEE_LIMIT:
        print("High fee")
    return fee


def process_all(students):
    for student in students:
        if student["type"] == StudentType.REGULAR:
            fee = tuition_fee(
                student["courses"], StudentType.REGULAR, student["summer"]
            )
        if student["type"] == StudentType.STAFF_CHILD:
            fee = tuition_fee(
                student["courses"], StudentType.STAFF_CHILD, student["summer"]
            )
        print(student["name"], fee)
