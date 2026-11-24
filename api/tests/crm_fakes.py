"""Test doubles for the GoHighLevel step. No test calls the real GoHighLevel API."""

from __future__ import annotations

from typing import Callable

from crm.contacts import Contact
from crm.errors import CrmError


class FakeCrmClient:
    """Records the contacts it is asked to send; can fail like GoHighLevel can."""

    def __init__(
        self,
        error: Exception | None = None,
        on_send: Callable[[Contact], None] | None = None,
    ) -> None:
        self.contacts: list[Contact] = []
        self.error = error
        self._on_send = on_send

    def send_contact(self, contact: Contact) -> None:
        self.contacts.append(contact)
        if self._on_send is not None:
            self._on_send(contact)
        if self.error is not None:
            raise self.error


def timeout_error() -> CrmError:
    return CrmError("timeout")


def http_error(status_code: int = 500) -> CrmError:
    return CrmError("http_error", status_code)
