"""GoogleSheetsLeadStorage tested with a fake gspread-like client (ADR-002).

No real network or credentials are used.
"""

from __future__ import annotations

import pytest

from storage.base import StorageError
from storage.google_sheets import CALCULATOR_COLUMN_ORDER, COLUMN_ORDER, GoogleSheetsLeadStorage

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
    "crm_status": "pending",
}


class _FakeWorksheet:
    def __init__(self, updated_range: str | None = "leads!A2:J2", values=None) -> None:
        self.append_row_calls: list[tuple[list, str]] = []
        self.update_cell_calls: list[tuple[int, int, str]] = []
        self._updated_range = updated_range
        self._values = values or []

    def append_row(self, row, value_input_option):
        self.append_row_calls.append((row, value_input_option))
        if self._updated_range is None:
            return {}
        return {"updates": {"updatedRange": self._updated_range}}

    def update_cell(self, row, col, value):
        self.update_cell_calls.append((row, col, value))

    def get_all_values(self):
        return self._values


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


# --- calculator tab (LEAD_API_CONTRACT.md section 11.5) ---------------------

CALCULATOR_LEAD = {
    "submitted_at": "08/11/2026 09:00:00",
    "name": "Ana María Pérez Soto",
    "email": "ana.perez@example.com",
    "phone": "",
    "language": "es",
    "months": "4.43",
    "zone": "alert",
    "consent": True,
    "marketing_consent": False,
    "source": "calculator",
    "privacy_notice_version": "2026-09-draft-1",
    "status": "started",
    "currency": "USD",
    "concentration_alert": True,
    "crm_status": "pending",
}


def test_calculator_columns_match_the_contract():
    assert CALCULATOR_COLUMN_ORDER == (
        "submitted_at",
        "name",
        "email",
        "phone",
        "language",
        "months",
        "zone",
        "consent",
        "marketing_consent",
        "source",
        "privacy_notice_version",
        "status",
        "currency",
        "concentration_alert",
        "crm_status",
    )


def test_vip_columns_end_with_crm_status():
    assert COLUMN_ORDER[-2:] == ("status", "crm_status")


def test_calculator_row_goes_to_its_tab_in_its_column_order_with_raw_input():
    worksheet = _FakeWorksheet()
    spreadsheet = _FakeSpreadsheet(worksheet, expected_tab="calculator")
    client = _FakeClient(spreadsheet, expected_sheet_id="sheet-123")
    storage = GoogleSheetsLeadStorage(
        service_account_file="/secure/service-account.json",
        sheet_id="sheet-123",
        sheet_tab="calculator",
        client_factory=lambda: client,
        columns=CALCULATOR_COLUMN_ORDER,
    )

    storage.save(CALCULATOR_LEAD)

    row, value_input_option = worksheet.append_row_calls[0]
    assert value_input_option == "RAW"
    assert row == [
        "08/11/2026 09:00:00",
        "Ana María Pérez Soto",
        "ana.perez@example.com",
        "",
        "es",
        "4.43",
        "alert",
        True,
        False,
        "calculator",
        "2026-09-draft-1",
        "started",
        "USD",
        True,
        "pending",
    ]


# --- crm_status (LEAD_API_CONTRACT.md section 12) --------------------------


def _calculator_storage(worksheet: _FakeWorksheet) -> GoogleSheetsLeadStorage:
    spreadsheet = _FakeSpreadsheet(worksheet, expected_tab="calculator")
    client = _FakeClient(spreadsheet, expected_sheet_id="sheet-123")
    return GoogleSheetsLeadStorage(
        service_account_file="/secure/service-account.json",
        sheet_id="sheet-123",
        sheet_tab="calculator",
        client_factory=lambda: client,
        columns=CALCULATOR_COLUMN_ORDER,
    )


@pytest.mark.parametrize(
    ("updated_range", "row_number"),
    [
        ("calculator!A5:O5", 5),
        ("'My calculator tab'!A12:O12", 12),
        ("calculator!A1043:O1043", 1043),
    ],
)
def test_save_returns_the_row_number_google_reports(updated_range, row_number):
    storage = _calculator_storage(_FakeWorksheet(updated_range=updated_range))

    assert storage.save(CALCULATOR_LEAD) == row_number


@pytest.mark.parametrize("updated_range", [None, "garbage"])
def test_save_returns_none_when_google_reports_no_usable_range(updated_range):
    storage = _calculator_storage(_FakeWorksheet(updated_range=updated_range))

    assert storage.save(CALCULATOR_LEAD) is None


def test_set_crm_status_updates_the_last_column_of_that_row():
    worksheet = _FakeWorksheet()
    storage = _calculator_storage(worksheet)

    storage.set_crm_status(7, "sent")

    assert worksheet.update_cell_calls == [(7, len(CALCULATOR_COLUMN_ORDER), "sent")]


def test_set_crm_status_without_a_row_number_does_nothing():
    worksheet = _FakeWorksheet()

    _calculator_storage(worksheet).set_crm_status(None, "sent")

    assert worksheet.update_cell_calls == []


def test_set_crm_status_wraps_failure_in_storage_error():
    storage = GoogleSheetsLeadStorage(
        service_account_file="/secure/service-account.json",
        sheet_id="sheet-123",
        sheet_tab="calculator",
        client_factory=_RaisingClientFactory(RuntimeError("network down")),
        columns=CALCULATOR_COLUMN_ORDER,
    )

    with pytest.raises(StorageError):
        storage.set_crm_status(7, "sent")


def test_saved_rows_reads_every_row_by_header_name_oldest_first():
    header = list(CALCULATOR_COLUMN_ORDER)
    row_sent = ["1", "A B", "a@example.com"] + [""] * (len(header) - 4) + ["sent"]
    row_failed = ["2", "C D", "c@example.com"] + [""] * (len(header) - 4) + ["failed"]
    row_short = ["3", "E F", "e@example.com"]  # a v1.2 row without the new columns
    worksheet = _FakeWorksheet(values=[header, row_sent, row_failed, row_short])

    rows = _calculator_storage(worksheet).saved_rows()

    assert [(reference, row["name"]) for reference, row in rows] == [
        (2, "A B"),
        (3, "C D"),
        (4, "E F"),
    ]
    assert rows[1][1]["email"] == "c@example.com"
    assert rows[1][1]["crm_status"] == "failed"
    assert rows[2][1]["crm_status"] == ""


def test_saved_rows_requires_the_column_in_the_header():
    header = [column for column in CALCULATOR_COLUMN_ORDER if column != "crm_status"]
    storage = _calculator_storage(_FakeWorksheet(values=[header]))

    with pytest.raises(StorageError):
        storage.saved_rows()


def test_saved_rows_wraps_failure_in_storage_error():
    storage = GoogleSheetsLeadStorage(
        service_account_file="/secure/service-account.json",
        sheet_id="sheet-123",
        sheet_tab="calculator",
        client_factory=_RaisingClientFactory(RuntimeError("network down")),
        columns=CALCULATOR_COLUMN_ORDER,
    )

    with pytest.raises(StorageError):
        storage.saved_rows()
