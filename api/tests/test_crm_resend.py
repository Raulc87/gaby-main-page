"""The resend command (LEAD_API_CONTRACT.md section 12, "Resending"), with a fake client."""

from __future__ import annotations

import logging

import pytest

import resend_crm
from crm.contacts import calculator_contact, vip_contact
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
