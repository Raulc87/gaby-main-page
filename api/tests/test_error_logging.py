"""US-016 AC1-AC3, AC6: ERROR logging on 503 and 500, without personal data."""

from __future__ import annotations

import logging

import gspread.exceptions as gspread_exceptions

from storage.base import StorageError

VALID_PAYLOAD = {
    "name": "Ana Perez",
    "email": "ana.perez@example.com",
    "phone": "+50684104791",
    "screening_answer": "needs_investment_info",
    "language": "es",
    "consent": True,
}


class _FailingStorage:
    def __init__(self, exc: Exception) -> None:
        self._exc = exc

    def save(self, lead: dict) -> None:
        raise self._exc


class _FakeGspreadResponse:
    """Minimal stand-in for the requests.Response gspread.APIError wraps."""

    def __init__(self, status_code: int) -> None:
        self.status_code = status_code

    def json(self):
        return {"error": {"code": self.status_code, "message": "Forbidden", "status": "x"}}


def _storage_error(cause: BaseException) -> StorageError:
    """A StorageError with `cause` as its __cause__, as production code
    raises it via `raise StorageError(...) from exc` in google_sheets.py.
    """
    error = StorageError("Failed to append lead to Google Sheets.")
    error.__cause__ = cause
    return error


# --- 503 / storage_unavailable (AC1) ------------------------------------


def test_storage_unavailable_logs_error_with_exception_class(app, client, caplog):
    caplog.set_level(logging.ERROR)
    app.config["LEAD_STORAGE"] = _FailingStorage(_storage_error(FileNotFoundError("boom")))

    response = client.post("/api/save-lead", json=VALID_PAYLOAD)

    assert response.status_code == 503
    error_records = [r for r in caplog.records if r.levelno == logging.ERROR]
    assert len(error_records) == 1
    message = error_records[0].getMessage()
    assert "storage_unavailable" in message
    assert "FileNotFoundError" in message


def test_storage_unavailable_logs_permission_error(app, client, caplog):
    caplog.set_level(logging.ERROR)
    app.config["LEAD_STORAGE"] = _FailingStorage(_storage_error(PermissionError("denied")))

    response = client.post("/api/save-lead", json=VALID_PAYLOAD)

    assert response.status_code == 503
    assert "PermissionError" in caplog.text


def test_storage_unavailable_logs_spreadsheet_not_found(app, client, caplog):
    caplog.set_level(logging.ERROR)
    cause = gspread_exceptions.SpreadsheetNotFound()
    app.config["LEAD_STORAGE"] = _FailingStorage(_storage_error(cause))

    response = client.post("/api/save-lead", json=VALID_PAYLOAD)

    assert response.status_code == 503
    assert "SpreadsheetNotFound" in caplog.text


def test_storage_unavailable_logs_google_api_error_with_http_status(app, client, caplog):
    caplog.set_level(logging.ERROR)
    cause = gspread_exceptions.APIError(_FakeGspreadResponse(403))
    app.config["LEAD_STORAGE"] = _FailingStorage(_storage_error(cause))

    response = client.post("/api/save-lead", json=VALID_PAYLOAD)

    assert response.status_code == 503
    assert "APIError 403" in caplog.text


# --- 500 / internal_error (AC2) -----------------------------------------


def test_internal_error_logs_exception_class_and_traceback(app, client, caplog):
    caplog.set_level(logging.ERROR)
    app.config["LEAD_STORAGE"] = _FailingStorage(RuntimeError("unexpected failure"))

    response = client.post("/api/save-lead", json=VALID_PAYLOAD)

    assert response.status_code == 500
    assert "internal_error" in caplog.text
    assert "RuntimeError" in caplog.text
    assert "Traceback (most recent call last)" in caplog.text
    # The exception's own message is never logged, even when it is
    # harmless: only its class and the traceback's stack frames are.
    assert "unexpected failure" not in caplog.text


def test_internal_error_does_not_log_a_pii_bearing_exception_message(app, client, caplog):
    """Regression: an unwrapped exception whose message happens to repeat
    request data (e.g. a future bug raising ValueError(lead["email"]))
    must not leak it through the 500 traceback (US-016 AC2/AC3).
    """
    caplog.set_level(logging.ERROR)
    exc = ValueError(
        f"could not serialise row for {VALID_PAYLOAD['email']} / {VALID_PAYLOAD['phone']}"
    )
    app.config["LEAD_STORAGE"] = _FailingStorage(exc)

    response = client.post("/api/save-lead", json=VALID_PAYLOAD)

    assert response.status_code == 500
    assert "ValueError" in caplog.text
    assert "Traceback (most recent call last)" in caplog.text
    assert VALID_PAYLOAD["email"] not in caplog.text
    assert VALID_PAYLOAD["phone"] not in caplog.text


# --- no personal data in logs (AC3, AC6) ---------------------------------


def test_logs_never_contain_submitted_personal_data(app, client, caplog):
    caplog.set_level(logging.INFO)

    app.config["LEAD_STORAGE"] = _FailingStorage(_storage_error(FileNotFoundError("boom")))
    client.post("/api/save-lead", json=VALID_PAYLOAD)

    app.config["LEAD_STORAGE"] = _FailingStorage(RuntimeError("unexpected"))
    client.post("/api/save-lead", json=VALID_PAYLOAD)

    pii_message = f"bad row: {VALID_PAYLOAD['name']} <{VALID_PAYLOAD['email']}>"
    app.config["LEAD_STORAGE"] = _FailingStorage(ValueError(pii_message))
    client.post("/api/save-lead", json=VALID_PAYLOAD)

    log_output = caplog.text
    assert VALID_PAYLOAD["name"] not in log_output
    assert VALID_PAYLOAD["email"] not in log_output
    assert VALID_PAYLOAD["phone"] not in log_output
