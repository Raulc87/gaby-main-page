"""Resend the GoHighLevel contacts that were not sent (LEAD_API_CONTRACT.md section 12).

    python resend_crm.py

Resends the rows whose `crm_status` is `failed` or `pending`, in both tabs
(Wealth Mastery applications and calculator leads), and updates the column.
Prints only counts. Needs the server's environment (the same variables as the
application: storage, `GHL_*`) and `GHL_SYNC=on`. Run by hand; the runbook is
docs/runbooks/GOHIGHLEVEL.md.
"""

from __future__ import annotations

import sys
from pathlib import Path

EXIT_OK = 0
EXIT_ROWS_STILL_FAILED = 1
EXIT_NOT_RUN = 2


def main() -> int:
    # Local development keeps its variables in api/.env (see run_local.py);
    # production has real environment variables and no .env file.
    try:
        from dotenv import load_dotenv

        load_dotenv(Path(__file__).resolve().parent / ".env")
    except ImportError:
        pass

    from config import Config
    from crm.contacts import calculator_contact, vip_contact
    from crm.resend import ResendResult, resend_contacts
    from crm.sync import create_crm_sync
    from storage import create_calculator_storage, create_storage
    from storage.base import StorageError

    config = Config()
    crm_sync = create_crm_sync(config)
    if not crm_sync.enabled:
        print("GHL_SYNC is off: nothing was resent. Set GHL_SYNC=on and try again.")
        return EXIT_NOT_RUN

    total = ResendResult()
    tabs = (
        ("applications", create_storage(config), vip_contact),
        ("calculator", create_calculator_storage(config), calculator_contact),
    )
    for tab_name, storage, build_contact in tabs:
        try:
            result = resend_contacts(storage, crm_sync, build_contact)
        except StorageError:
            print(f"{tab_name}: the rows could not be read from storage. Nothing was resent.")
            return EXIT_NOT_RUN
        print(
            f"{tab_name}: sent {result.sent}, failed {result.failed}, "
            f"sent but status not updated {result.not_updated}"
        )
        total += result

    return EXIT_ROWS_STILL_FAILED if total.failed or total.not_updated else EXIT_OK


if __name__ == "__main__":
    sys.exit(main())
