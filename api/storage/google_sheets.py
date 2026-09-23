"""Google Sheets lead storage adapter (ADR-002).

Appends one row per lead, in the column order from LEAD_API_CONTRACT.md
section 6, using RAW value input so values are stored as literal text.

Never logs the lead payload or credentials: any failure is wrapped in a
StorageError with a generic message only.
"""

from __future__ import annotations

from typing import Any, Callable

from .base import LeadStorage, StorageError

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
)


class GoogleSheetsLeadStorage(LeadStorage):
    def __init__(
        self,
        service_account_file: str | None,
        sheet_id: str | None,
        sheet_tab: str,
        client_factory: Callable[[], Any] | None = None,
    ) -> None:
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

    def save(self, lead: dict) -> None:
        row = [lead.get(column) for column in COLUMN_ORDER]
        try:
            client = self._client_factory()
            spreadsheet = client.open_by_key(self._sheet_id)
            worksheet = spreadsheet.worksheet(self._sheet_tab)
            worksheet.append_row(row, value_input_option="RAW")
        except StorageError:
            raise
        except Exception as exc:  # noqa: BLE001 - any failure degrades to a generic StorageError
            raise StorageError("Failed to append lead to Google Sheets.") from exc
