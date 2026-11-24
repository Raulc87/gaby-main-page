"""Google Sheets lead storage adapter (ADR-002).

Appends one row per lead, in the column order from LEAD_API_CONTRACT.md
section 6 (VIP leads) or 11.5 (calculator leads), using RAW value input so values are stored as literal text.

A saved row's `crm_status` is updated afterwards by its row number (section 12).

Never logs the lead payload or credentials: any failure is wrapped in a
StorageError with a generic message only.
"""

from __future__ import annotations

import re
from typing import Any, Callable

from .base import LeadStorage, RowReference, StorageError

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

COLUMN_ORDER = (
    "submitted_at",
    "name",
    "email",
    "phone",
    "screening_answer",
    "language",
    "consent",
    "privacy_notice_version",
    "status",
    "crm_status",
)

# LEAD_API_CONTRACT.md section 11.5.
CALCULATOR_COLUMN_ORDER = (
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

CRM_STATUS_COLUMN = "crm_status"
# The range Google answers an append with, such as "calculator!A5:O5" or "'My tab'!A5:O5".
UPDATED_RANGE_LAST_ROW = re.compile(r":[A-Z]+(\d+)$")


class GoogleSheetsLeadStorage(LeadStorage):
    def __init__(
        self,
        service_account_file: str | None,
        sheet_id: str | None,
        sheet_tab: str,
        client_factory: Callable[[], Any] | None = None,
        columns: tuple[str, ...] = COLUMN_ORDER,
    ) -> None:
        self._columns = columns
        self._service_account_file = service_account_file
        self._sheet_id = sheet_id
        self._sheet_tab = sheet_tab
        self._client_factory = client_factory or self._authorized_client

    def _authorized_client(self) -> Any:
        import gspread
        from google.oauth2.service_account import Credentials

        credentials = Credentials.from_service_account_file(
            self._service_account_file, scopes=SCOPES
        )
        return gspread.authorize(credentials)

    def _worksheet(self) -> Any:
        client = self._client_factory()
        return client.open_by_key(self._sheet_id).worksheet(self._sheet_tab)

    def save(self, lead: dict) -> RowReference:
        row = [lead.get(column) for column in self._columns]
        try:
            response = self._worksheet().append_row(row, value_input_option="RAW")
        except StorageError:
            raise
        except Exception as exc:  # noqa: BLE001 - any failure degrades to a generic StorageError
            raise StorageError("Failed to append lead to Google Sheets.") from exc
        return _appended_row_number(response)

    def set_crm_status(self, reference: RowReference, crm_status: str) -> None:
        if reference is None:
            return
        column_number = self._columns.index(CRM_STATUS_COLUMN) + 1
        try:
            self._worksheet().update_cell(reference, column_number, crm_status)
        except StorageError:
            raise
        except Exception as exc:  # noqa: BLE001 - any failure degrades to a generic StorageError
            raise StorageError("Failed to update crm_status in Google Sheets.") from exc

    def saved_rows(self) -> list[tuple[RowReference, dict]]:
        """Every row below the header, oldest first, read by the header row's names."""
        try:
            values = self._worksheet().get_all_values()
        except StorageError:
            raise
        except Exception as exc:  # noqa: BLE001 - any failure degrades to a generic StorageError
            raise StorageError("Failed to read leads from Google Sheets.") from exc

        if not values or CRM_STATUS_COLUMN not in values[0]:
            raise StorageError("The sheet has no crm_status column.")
        header = values[0]
        # set_crm_status writes by the column's expected position (as append_row
        # does), so a header that moved crm_status would make a resend update
        # the wrong cell. Fail loudly instead.
        if header.index(CRM_STATUS_COLUMN) != self._columns.index(CRM_STATUS_COLUMN):
            raise StorageError("The crm_status column is not where the contract puts it.")
        return [
            (row_number, dict(zip(header, cells + [""] * (len(header) - len(cells)))))
            for row_number, cells in enumerate(values[1:], start=2)
        ]


def _appended_row_number(append_response: Any) -> RowReference:
    """The sheet row Google reports for the appended values, or None if it says nothing usable."""
    try:
        updated_range = append_response["updates"]["updatedRange"]
    except (KeyError, TypeError):
        return None
    match = UPDATED_RANGE_LAST_ROW.search(str(updated_range))
    return int(match.group(1)) if match else None
