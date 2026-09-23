"""GoogleSheetsLeadStorage tested with a fake gspread-like client (ADR-002).

No real network or credentials are used.
"""

from __future__ import annotations

import pytest

from storage.base import StorageError
from storage.google_sheets import COLUMN_ORDER, GoogleSheetsLeadStorage

LEAD = {
    "submitted_at": "23/09/2026 14:05:31",
    "name": "Ana Perez",
    "email": "ana.perez@example.com",
    "phone": "+50684104791",
    "screening_answer": "needs_investment_info",
    "language": "es",
    "consent": True,
    "privacy_notice_version": "2026-09-draft-1",
    "status": "started",
}


class _FakeWorksheet:
    def __init__(self) -> None:
        self.append_row_calls: list[tuple[list, str]] = []

    def append_row(self, row, value_input_option):
        self.append_row_calls.append((row, value_input_option))


class _FakeSpreadsheet:
    def __init__(self, worksheet: _FakeWorksheet, expected_tab: str) -> None:
        self._worksheet = worksheet
        self._expected_tab = expected_tab

    def worksheet(self, name):
        assert name == self._expected_tab
        return self._worksheet


class _FakeClient:
    def __init__(self, spreadsheet: _FakeSpreadsheet, expected_sheet_id: str) -> None:
        self._spreadsheet = spreadsheet
        self._expected_sheet_id = expected_sheet_id

    def open_by_key(self, sheet_id):
        assert sheet_id == self._expected_sheet_id
        return self._spreadsheet


class _RaisingClientFactory:
    def __init__(self, exc: Exception) -> None:
        self._exc = exc

    def __call__(self):
        raise self._exc


def _build_storage(worksheet: _FakeWorksheet) -> GoogleSheetsLeadStorage:
    spreadsheet = _FakeSpreadsheet(worksheet, expected_tab="leads")
    client = _FakeClient(spreadsheet, expected_sheet_id="sheet-123")
    return GoogleSheetsLeadStorage(
        service_account_file="/secure/service-account.json",
        sheet_id="sheet-123",
        sheet_tab="leads",
        client_factory=lambda: client,
    )


def test_save_appends_row_in_contract_column_order_with_raw_input():
    worksheet = _FakeWorksheet()
    storage = _build_storage(worksheet)

    storage.save(LEAD)

    assert len(worksheet.append_row_calls) == 1
    row, value_input_option = worksheet.append_row_calls[0]
    assert value_input_option == "RAW"
    assert row == [LEAD[column] for column in COLUMN_ORDER]


def test_save_wraps_client_failure_in_storage_error():
    storage = GoogleSheetsLeadStorage(
        service_account_file="/secure/service-account.json",
        sheet_id="sheet-123",
        sheet_tab="leads",
        client_factory=_RaisingClientFactory(RuntimeError("network down")),
    )

    with pytest.raises(StorageError):
        storage.save(LEAD)


def test_save_wraps_worksheet_lookup_failure_in_storage_error():
    class _MissingTabSpreadsheet:
        def worksheet(self, name):
            raise KeyError("worksheet not found")

    client = _FakeClient(_MissingTabSpreadsheet(), expected_sheet_id="sheet-123")
    storage = GoogleSheetsLeadStorage(
        service_account_file="/secure/service-account.json",
        sheet_id="sheet-123",
        sheet_tab="leads",
        client_factory=lambda: client,
    )

    with pytest.raises(StorageError):
        storage.save(LEAD)
