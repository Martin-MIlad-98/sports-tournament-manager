MAX_HOURS = 18


class RegistrationError(Exception):
    pass


class Student:
    def __init__(self, student_id):
        self.student_id = student_id
        self.total_hours = 0
        self.codes = set()

    def register(self, code, hours):
        if code in self.codes:
            raise RegistrationError(f"{code} is already registered")
        if self.total_hours + hours > MAX_HOURS:
            raise RegistrationError("credit-hour limit is 18")
        self.codes.add(code)
        self.total_hours += hours
