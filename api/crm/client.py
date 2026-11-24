"""GoHighLevel contacts client (LEAD_API_CONTRACT.md section 12, ADR-008).

Two requests per contact, both against GoHighLevel's API v2 (verified against
its documentation, not exercised by any test or agent):

1. `POST /contacts/upsert` creates the contact or updates the one that matches
   the email, and sets the custom fields. The tags are NOT sent here: the
   documentation says the upsert's `tags` "will overwrite all current tags",
   while the contract says an existing contact keeps its other tags.
2. `POST /contacts/{id}/tags` adds the tags to the contact's own.

Sending the same contact again is safe, which the resend command relies on.

The token goes only in the Authorization header and is never logged, put in
an error or echoed. Requests use HTTPS with certificate verification (the
default of `urllib`) and are never redirected: a redirect could carry the
header to another host.
"""

from __future__ import annotations

import json
import socket
import urllib.error
import urllib.request
from typing import Callable
from urllib.parse import quote

from crm.contacts import Contact
from crm.errors import CrmError

API_BASE_URL = "https://services.leadconnectorhq.com"
UPSERT_PATH = "/contacts/upsert"
ADD_TAGS_PATH = "/contacts/{contact_id}/tags"
# The `Version` header each endpoint's documentation asks for.
UPSERT_API_VERSION = "2021-07-28"
ADD_TAGS_API_VERSION = "2021-07-28"
USER_AGENT = "gaby-main-page-backend"


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: D401, ANN001
        return None


# (request, timeout_seconds) -> (HTTP status, response body bytes). A 4xx or
# 5xx answer is returned like any other; only a failure to get an answer raises.
Transport = Callable[[urllib.request.Request, float], tuple[int, bytes]]


def _https_transport(request: urllib.request.Request, timeout_seconds: float) -> tuple[int, bytes]:
    opener = urllib.request.build_opener(_NoRedirect)
    try:
        with opener.open(request, timeout=timeout_seconds) as response:
            return response.status, response.read()
    except urllib.error.HTTPError as exc:
        return exc.code, b""
    except (TimeoutError, socket.timeout) as exc:
        raise CrmError("timeout") from exc
    except urllib.error.URLError as exc:
        if isinstance(exc.reason, (TimeoutError, socket.timeout)):
            raise CrmError("timeout") from exc
        raise CrmError("network") from exc
    except OSError as exc:
        raise CrmError("network") from exc


class GoHighLevelClient:
    def __init__(
        self,
        api_token: str | None,
        location_id: str | None,
        field_ids: dict[str, str | None],
        timeout_seconds: float,
        transport: Transport = _https_transport,
    ) -> None:
        self._api_token = api_token
        self._location_id = location_id
        self._field_ids = field_ids
        self._timeout_seconds = timeout_seconds
        self._transport = transport

    def send_contact(self, contact: Contact) -> None:
        """Create or update the contact and add its tags. Raises CrmError."""
        self._require_configuration(contact)
        contact_id = self._upsert(contact)
        if contact.tags:
            self._add_tags(contact_id, contact.tags)

    def _require_configuration(self, contact: Contact) -> None:
        if not self._api_token or not self._location_id:
            raise CrmError("not_configured")
        if any(not self._field_ids.get(name) for name in contact.custom_fields):
            raise CrmError("not_configured")

    def _upsert(self, contact: Contact) -> str:
        body: dict = {
            "locationId": self._location_id,
            "name": contact.name,
            "email": contact.email,
            "customFields": [
                {"id": self._field_ids[name], "fieldValue": value}
                for name, value in contact.custom_fields.items()
            ],
        }
        if contact.phone:
            body["phone"] = contact.phone
        response = self._post(UPSERT_PATH, UPSERT_API_VERSION, body)
        try:
            contact_id = response["contact"]["id"]
        except (KeyError, TypeError):
            raise CrmError("invalid_response") from None
        if not isinstance(contact_id, str) or not contact_id:
            raise CrmError("invalid_response")
        return contact_id

    def _add_tags(self, contact_id: str, tags: tuple[str, ...]) -> None:
        path = ADD_TAGS_PATH.format(contact_id=quote(contact_id, safe=""))
        self._post(path, ADD_TAGS_API_VERSION, {"tags": list(tags)})

    def _post(self, path: str, api_version: str, body: dict) -> dict:
        request = urllib.request.Request(
            API_BASE_URL + path,
            data=json.dumps(body).encode("utf-8"),
            method="POST",
            headers={
                "Authorization": f"Bearer {self._api_token}",
                "Version": api_version,
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": USER_AGENT,
            },
        )
        status, response_body = self._transport(request, self._timeout_seconds)
        if not 200 <= status < 300:
            raise CrmError("http_error", status)
        try:
            parsed = json.loads(response_body or b"{}")
        except ValueError:
            raise CrmError("invalid_response") from None
        return parsed if isinstance(parsed, dict) else {}
