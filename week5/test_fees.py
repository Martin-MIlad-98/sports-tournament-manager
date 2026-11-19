"""Characterization and regression tests for the refactored fee module."""

import pytest

from fees import Course, StudentType, process_all, tuition_fee
from legacy_fees import calc


def legacy_courses(*hours):
    return [{"h": hour} for hour in hours]


def courses(*hours):
    return [Course(hour) for hour in hours]


def student(name, kind):
    return {"name": name, "type": kind, "courses": courses(3), "summer": False}


@pytest.mark.parametrize(
    ("hours", "legacy_code", "kind", "summer"),
    [
        ((3, 3, 3), 1, StudentType.REGULAR, False),
        ((3, 3, 3, 3, 3, 3), 1, StudentType.REGULAR, True),
        ((3, 4), 2, StudentType.STAFF_CHILD, False),
        ((3, 3), 3, StudentType.SCHOLARSHIP, True),
    ],
)
def test_same_result_as_legacy(hours, legacy_code, kind, summer):
    old_result = calc(legacy_courses(*hours), legacy_code, 2026, summer, None)
    new_result = tuition_fee(courses(*hours), kind, summer)
    assert new_result == old_result


def test_large_fee_gets_reduction():
    assert tuition_fee(courses(6, 6, 6), StudentType.REGULAR) == 6100


def test_scholarship_student_is_not_skipped():
    students = [
        student("Sara", StudentType.REGULAR),
        student("Omar", StudentType.SCHOLARSHIP),
    ]
    assert process_all(students) == {"Sara": 1050, "Omar": 0}


def test_scholarship_first_student_is_also_processed():
    students = [student("Omar", StudentType.SCHOLARSHIP)]
    assert process_all(students) == {"Omar": 0}


def test_extras_default_is_not_shared_between_calls():
    assert tuition_fee(courses(1), StudentType.REGULAR, extras=(10,)) == 360
    assert tuition_fee(courses(1), StudentType.REGULAR) == 350


def test_fee_report_is_text_and_does_not_print(capsys):
    from fees import fee_report

    assert fee_report("Sara", 6100) == "Sara: 6100\nHigh fee"
    assert capsys.readouterr().out == ""


def test_unknown_student_type_is_rejected():
    with pytest.raises(ValueError, match="unsupported student type"):
        tuition_fee(courses(1), 99)
