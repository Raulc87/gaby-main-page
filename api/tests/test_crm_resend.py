"""The resend command (LEAD_API_CONTRACT.md section 12, "Resending"), with a fake client."""

from __future__ import annotations

import logging

import pytest

import resend_crm
from crm.contacts import Contact, calculator_contact, vip_contact
from crm.resend import ResendResult, resend_contacts
from crm.sync import CrmSync
from storage.base import StorageError
from storage.memory import MemoryLeadStorage
from tests.crm_fakes import FakeCrmClient, http_error
from tests.test_crm_contacts import CALCULATOR_ROW, VIP_ROW


def _storage_with(*statuses: str, template=CALCULATOR_ROW) -> MemoryLeadStorage:
    storage = MemoryLeadStorage()
    for index, status in enumerate(statuses):
        storage.save(
            {**template, "email": f"person{index}@example.com", "crm_status": status,
             "submitted_at": f"24/11/2026 10:00:0{index}"}
        )
    return storage


def _statuses(storage: MemoryLeadStorage) -> list[str]:
    return [row["crm_status"] for row in storage.leads]


def test_failed_and_pending_rows_are_resent_and_marked_sent():
    storage = _storage_with("failed", "sent", "pending", "off")
    fake = FakeCrmClient()

    result = resend_contacts(storage, CrmSync(enabled=True, client=fake), calculator_contact)

    assert result == ResendResult(sent=2, failed=0, not_updated=0)
    assert [c.email for c in fake.contacts] == ["person0@example.com", "person2@example.com"]
    assert _statuses(storage) == ["sent", "sent", "sent", "off"]


def test_rows_that_fail_again_stay_failed():
    storage = _storage_with("failed", "pending")
    sync = CrmSync(enabled=True, client=FakeCrmClient(error=http_error(500)))

    result = resend_contacts(storage, sync, calculator_contact)

    assert result == ResendResult(sent=0, failed=2, not_updated=0)
    assert _statuses(storage) == ["failed", "failed"]


def test_application_rows_are_resent_with_their_own_contact():
    storage = _storage_with("failed", template=VIP_ROW)
    fake = FakeCrmClient()

    resend_contacts(storage, CrmSync(enabled=True, client=fake), vip_contact)

    assert fake.contacts[0].tags == ("aplicacion-vip", "idioma-en")
    assert _statuses(storage) == ["sent"]


def test_a_row_sent_but_not_updated_is_counted_and_stays_resendable():
    storage = _storage_with("pending")
    storage.set_crm_status = _raise_storage_error  # type: ignore[method-assign]

    result = resend_contacts(storage, CrmSync(enabled=True, client=FakeCrmClient()), calculator_contact)

    assert result == ResendResult(sent=0, failed=0, not_updated=1)
    assert _statuses(storage) == ["pending"]


def _raise_storage_error(reference, crm_status):
    raise StorageError("boom")


# --- contract v1.3.1: an older duplicate is marked superseded, not sent -----------------


def _row(email: str, status: str, months: str, zone: str, second: int) -> dict:
    return {
        **CALCULATOR_ROW,
        "email": email,
        "months": months,
        "zone": zone,
        "crm_status": status,
        "submitted_at": f"24/11/2026 10:00:0{second}",
    }


def _storage_of(*rows: dict) -> MemoryLeadStorage:
    storage = MemoryLeadStorage()
    for row in rows:
        storage.save(row)
    return storage


def test_an_older_failed_row_with_a_later_duplicate_is_marked_superseded_and_not_sent():
    storage = _storage_of(
        _row("ana@example.com", "failed", "4.40", "alert", 0),
        _row("ana@example.com", "sent", "36.00", "solid_cushion", 1),
    )
    fake = FakeCrmClient()

    result = resend_contacts(storage, CrmSync(enabled=True, client=fake), calculator_contact)

    assert fake.contacts == []
    assert result == ResendResult(superseded=1)
    assert _statuses(storage) == ["superseded", "sent"]


def test_an_older_pending_row_with_a_later_duplicate_is_marked_superseded():
    storage = _storage_of(
        _row("ana@example.com", "pending", "4.40", "alert", 0),
        _row("ana@example.com", "sent", "36.00", "solid_cushion", 1),
    )
    fake = FakeCrmClient()

    resend_contacts(storage, CrmSync(enabled=True, client=fake), calculator_contact)

    assert fake.contacts == []
    assert _statuses(storage) == ["superseded", "sent"]


def test_a_row_with_no_later_duplicate_is_still_resent():
    storage = _storage_of(
        _row("ana@example.com", "sent", "4.40", "alert", 0),
        _row("ana@example.com", "failed", "36.00", "solid_cushion", 1),
        _row("luis@example.com", "pending", "7.00", "building", 2),
    )
    fake = FakeCrmClient()

    result = resend_contacts(storage, CrmSync(enabled=True, client=fake), calculator_contact)

    assert [c.email for c in fake.contacts] == ["ana@example.com", "luis@example.com"]
    assert result == ResendResult(sent=2)
    assert _statuses(storage) == ["sent", "sent", "sent"]


def test_of_several_unsent_rows_only_the_latest_is_sent_and_the_older_are_superseded():
    storage = _storage_of(
        _row("ana@example.com", "failed", "4.40", "alert", 0),
        _row("ana@example.com", "pending", "7.00", "building", 1),
        _row("ana@example.com", "failed", "36.00", "solid_cushion", 2),
    )
    fake = FakeCrmClient()

    result = resend_contacts(storage, CrmSync(enabled=True, client=fake), calculator_contact)

    assert [c.custom_fields["zona"] for c in fake.contacts] == ["Colchón sólido"]
    assert result == ResendResult(sent=1, superseded=2)
    assert _statuses(storage) == ["superseded", "superseded", "sent"]


def test_a_later_row_of_any_status_supersedes_an_older_unsent_one():
    storage = _storage_of(
        _row("a@example.com", "failed", "4.40", "alert", 0),
        _row("a@example.com", "off", "36.00", "solid_cushion", 1),
        _row("b@example.com", "failed", "4.40", "alert", 2),
        _row("b@example.com", "superseded", "36.00", "solid_cushion", 3),
    )
    fake = FakeCrmClient()

    result = resend_contacts(storage, CrmSync(enabled=True, client=fake), calculator_contact)

    assert fake.contacts == []
    assert result == ResendResult(superseded=2)
    assert _statuses(storage) == ["superseded", "off", "superseded", "superseded"]


def test_a_superseded_row_is_never_resent():
    storage = _storage_of(_row("ana@example.com", "superseded", "4.40", "alert", 0))
    fake = FakeCrmClient()

    result = resend_contacts(storage, CrmSync(enabled=True, client=fake), calculator_contact)

    assert fake.contacts == []
    assert result == ResendResult()
    assert _statuses(storage) == ["superseded"]


def test_running_the_command_twice_changes_nothing_the_second_time():
    storage = _storage_of(
        _row("ana@example.com", "failed", "4.40", "alert", 0),
        _row("ana@example.com", "failed", "36.00", "solid_cushion", 1),
    )
    fake = FakeCrmClient()
    sync = CrmSync(enabled=True, client=fake)

    resend_contacts(storage, sync, calculator_contact)
    second = resend_contacts(storage, sync, calculator_contact)

    assert second == ResendResult()
    assert len(fake.contacts) == 1
    assert _statuses(storage) == ["superseded", "sent"]


def test_rows_of_different_emails_do_not_supersede_each_other():
    storage = _storage_of(
        _row("ana@example.com", "failed", "4.40", "alert", 0),
        _row("luis@example.com", "sent", "36.00", "solid_cushion", 1),
    )

    result = resend_contacts(storage, CrmSync(enabled=True, client=FakeCrmClient()), calculator_contact)

    assert result == ResendResult(sent=1)
    assert _statuses(storage) == ["sent", "sent"]


def test_the_email_comparison_ignores_case_and_surrounding_spaces():
    storage = _storage_of(
        _row("ana@example.com", "failed", "4.40", "alert", 0),
        _row(" Ana@Example.com ", "sent", "36.00", "solid_cushion", 1),
    )

    result = resend_contacts(storage, CrmSync(enabled=True, client=FakeCrmClient()), calculator_contact)

    assert result == ResendResult(superseded=1)


def test_the_contact_ends_with_the_newest_values_after_a_resend():
    """A stateful fake of GoHighLevel: the last contact sent for an email is what it holds."""
    held: dict[str, Contact] = {}
    storage = _storage_of(
        _row("ana@example.com", "failed", "4.40", "alert", 0),
        _row("ana@example.com", "sent", "36.00", "solid_cushion", 1),
    )
    held["ana@example.com"] = calculator_contact(storage.saved_rows()[1][1])
    fake = FakeCrmClient(on_send=lambda contact: held.__setitem__(contact.email, contact))

    resend_contacts(storage, CrmSync(enabled=True, client=fake), calculator_contact)

    assert held["ana@example.com"].custom_fields["zona"] == "Colchón sólido"
    assert held["ana@example.com"].custom_fields["meses"] == "36"


def test_each_tab_is_resent_on_its_own():
    """Rows of the same email in the application tab and the calculator tab never supersede each other."""
    applications = _storage_of({**VIP_ROW, "email": "ana@example.com", "crm_status": "failed"})
    calculator = _storage_of(_row("ana@example.com", "sent", "36.00", "solid_cushion", 1))
    fake = FakeCrmClient()
    sync = CrmSync(enabled=True, client=fake)

    resend_contacts(applications, sync, vip_contact)
    resend_contacts(calculator, sync, calculator_contact)

    assert _statuses(applications) == ["sent"]
    assert len(fake.contacts) == 1


def test_a_failed_mark_is_counted_and_the_row_stays_resendable():
    storage = _storage_of(
        _row("ana@example.com", "failed", "4.40", "alert", 0),
        _row("ana@example.com", "sent", "36.00", "solid_cushion", 1),
    )
    storage.set_crm_status = _raise_storage_error  # type: ignore[method-assign]

    result = resend_contacts(storage, CrmSync(enabled=True, client=FakeCrmClient()), calculator_contact)

    assert result == ResendResult(not_updated=1)
    assert _statuses(storage) == ["failed", "sent"]


def test_marking_superseded_logs_no_personal_data(caplog):
    storage = _storage_of(
        _row("ana@example.com", "failed", "4.40", "alert", 0),
        _row("ana@example.com", "sent", "36.00", "solid_cushion", 1),
    )
    storage.set_crm_status = _raise_storage_error  # type: ignore[method-assign]

    with caplog.at_level(logging.DEBUG):
        resend_contacts(storage, CrmSync(enabled=True, client=FakeCrmClient()), calculator_contact)

    assert "ana@example.com" not in caplog.text
    assert "submitted_at=24/11/2026 10:00:00" in caplog.text


def test_nothing_to_resend_sends_nothing():
    fake = FakeCrmClient()

    result = resend_contacts(_storage_with("sent", "off"), CrmSync(enabled=True, client=fake), calculator_contact)

    assert result == ResendResult()
    assert fake.contacts == []


def test_resending_logs_no_personal_data(caplog):
    storage = _storage_with("failed")
    sync = CrmSync(enabled=True, client=FakeCrmClient(error=http_error(500)))

    with caplog.at_level(logging.DEBUG):
        resend_contacts(storage, sync, calculator_contact)

    assert "person0@example.com" not in caplog.text
    assert "http_error 500" in caplog.text


# --- the command -------------------------------------------------------------------


@pytest.fixture()
def command_environment(monkeypatch):
    for variable in ("GHL_SYNC", "GHL_API_TOKEN", "GHL_LOCATION_ID"):
        monkeypatch.delenv(variable, raising=False)
    monkeypatch.setenv("LEADS_STORAGE", "memory")


def test_the_command_does_nothing_when_sync_is_off(command_environment, capsys):
    assert resend_crm.main() == resend_crm.EXIT_NOT_RUN
    assert "GHL_SYNC is off" in capsys.readouterr().out


def test_the_command_reports_counts_for_both_tabs(command_environment, monkeypatch, capsys):
    monkeypatch.setenv("GHL_SYNC", "on")  # memory storage is empty: no request is made

    assert resend_crm.main() == resend_crm.EXIT_OK

    output = capsys.readouterr().out
    assert "applications: sent 0, failed 0" in output
    assert "calculator: sent 0, failed 0" in output
    assert "marked superseded 0" in output
