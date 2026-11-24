"""The GoHighLevel client (crm/client.py), with a fake transport: no request leaves the machine.

The requests are checked against GoHighLevel's API v2 documentation as read
for US-045 (Upsert Contact and Add Tags); see the PR for what was verified.
"""

from __future__ import annotations

import http.server
import json
import threading
import time
import urllib.request

import pytest

from crm.client import GoHighLevelClient, _https_transport
from crm.contacts import Contact, calculator_contact
from crm.errors import CrmError
from tests.test_crm_contacts import CALCULATOR_ROW

TOKEN = "pit-secret-token-123"
FIELD_IDS = {
    "meses": "id-meses",
    "zona": "id-zona",
    "moneda": "id-moneda",
    "alerta_concentracion": "id-alerta",
    "preseleccion": "id-preseleccion",
}


class _Transport:
    def __init__(self, responses=None) -> None:
        self.requests: list[tuple[urllib.request.Request, float]] = []
        self._responses = list(responses or [])

    def __call__(self, request, timeout_seconds):
        self.requests.append((request, timeout_seconds))
        if self._responses:
            response = self._responses.pop(0)
            if isinstance(response, Exception):
                raise response
            return response
        return 201, json.dumps({"new": True, "contact": {"id": "contact-1"}}).encode()


def _client(transport, **overrides) -> GoHighLevelClient:
    settings = {
        "api_token": TOKEN,
        "location_id": "location-1",
        "field_ids": FIELD_IDS,
        "timeout_seconds": 3.0,
        "transport": transport,
    }
    settings.update(overrides)
    return GoHighLevelClient(**settings)


def _body(request) -> dict:
    return json.loads(request.data)


CONTACT = calculator_contact({**CALCULATOR_ROW, "phone": "+50684104791", "marketing_consent": True})


def test_contact_is_upserted_then_its_tags_are_added():
    transport = _Transport()

    _client(transport).send_contact(CONTACT)

    (upsert, _), (add_tags, _) = transport.requests
    assert upsert.full_url == "https://services.leadconnectorhq.com/contacts/upsert"
    assert upsert.get_method() == "POST"
    assert add_tags.full_url == "https://services.leadconnectorhq.com/contacts/contact-1/tags"
    assert add_tags.get_method() == "POST"


def test_upsert_body_has_the_contact_and_custom_fields_but_no_tags():
    transport = _Transport()

    _client(transport).send_contact(CONTACT)

    body = _body(transport.requests[0][0])
    assert body == {
        "locationId": "location-1",
        "name": "Ana María Pérez Soto",
        "email": "ana.perez@example.com",
        "phone": "+50684104791",
        "customFields": [
            {"id": "id-meses", "fieldValue": "4,4"},
            {"id": "id-zona", "fieldValue": "Zona de alerta"},
            {"id": "id-moneda", "fieldValue": "USD"},
            {"id": "id-alerta", "fieldValue": "sí"},
        ],
    }
    # GoHighLevel's upsert overwrites all current tags when `tags` is sent;
    # an existing contact must keep its other tags (contract section 12).
    assert "tags" not in body


def test_tags_are_added_not_set():
    transport = _Transport()

    _client(transport).send_contact(CONTACT)

    assert _body(transport.requests[1][0]) == {
        "tags": ["lead-calculadora", "idioma-es", "consentimiento-correos"]
    }


def test_phone_is_left_out_when_not_given():
    transport = _Transport()

    _client(transport).send_contact(calculator_contact(CALCULATOR_ROW))

    assert "phone" not in _body(transport.requests[0][0])


def test_empty_meses_is_sent_as_an_empty_value():
    transport = _Transport()
    row = {**CALCULATOR_ROW, "months": "", "zone": "financially_free"}

    _client(transport).send_contact(calculator_contact(row))

    fields = {f["id"]: f["fieldValue"] for f in _body(transport.requests[0][0])["customFields"]}
    assert fields["id-meses"] == ""


def test_requests_carry_the_token_and_the_documented_headers():
    transport = _Transport()

    _client(transport).send_contact(CONTACT)

    for request, timeout in transport.requests:
        assert request.get_header("Authorization") == f"Bearer {TOKEN}"
        assert request.get_header("Version") == "2021-07-28"
        assert request.get_header("Content-type") == "application/json"
        assert timeout == 3.0
        # The token only ever travels in the header.
        assert TOKEN not in request.full_url
        assert TOKEN not in request.data.decode()


def test_a_contact_without_tags_makes_only_the_upsert():
    transport = _Transport()

    _client(transport).send_contact(Contact(name="Ana Perez", email="ana@example.com"))

    assert len(transport.requests) == 1


def test_the_contact_id_is_url_encoded_in_the_tags_path():
    transport = _Transport(
        [(201, json.dumps({"contact": {"id": "a/b?c"}}).encode()), (201, b"{}")]
    )

    _client(transport).send_contact(CONTACT)

    assert transport.requests[1][0].full_url.endswith("/contacts/a%2Fb%3Fc/tags")


@pytest.mark.parametrize(
    "overrides",
    [
        {"api_token": None},
        {"api_token": ""},
        {"location_id": None},
        {"field_ids": {**FIELD_IDS, "zona": None}},
        {"field_ids": {}},
    ],
)
def test_incomplete_configuration_sends_nothing_and_fails(overrides):
    transport = _Transport()

    with pytest.raises(CrmError) as error:
        _client(transport, **overrides).send_contact(CONTACT)

    assert error.value.reason == "not_configured"
    assert transport.requests == []


def test_a_field_id_the_contact_does_not_use_is_not_required():
    transport = _Transport()
    ids = {**FIELD_IDS, "preseleccion": None}

    _client(transport, field_ids=ids).send_contact(CONTACT)

    assert len(transport.requests) == 2


@pytest.mark.parametrize("status", [400, 401, 403, 422, 429, 500, 503, 302])
def test_an_error_response_to_the_upsert_fails_and_skips_the_tags(status):
    transport = _Transport([(status, b'{"message":"nope"}')])

    with pytest.raises(CrmError) as error:
        _client(transport).send_contact(CONTACT)

    assert (error.value.reason, error.value.status_code) == ("http_error", status)
    assert len(transport.requests) == 1


def test_an_error_response_to_the_tags_fails():
    transport = _Transport([(201, b'{"contact":{"id":"c1"}}'), (422, b"{}")])

    with pytest.raises(CrmError) as error:
        _client(transport).send_contact(CONTACT)

    assert error.value.status_code == 422


@pytest.mark.parametrize("body", [b"not json", b"[]", b"{}", b'{"contact": {}}', b'{"contact": {"id": ""}}'])
def test_an_upsert_answer_without_a_contact_id_fails(body):
    transport = _Transport([(201, body)])

    with pytest.raises(CrmError) as error:
        _client(transport).send_contact(CONTACT)

    assert error.value.reason == "invalid_response"


@pytest.mark.parametrize("reason", ["timeout", "network"])
def test_transport_failures_propagate(reason):
    transport = _Transport([CrmError(reason)])

    with pytest.raises(CrmError) as error:
        _client(transport).send_contact(CONTACT)

    assert error.value.reason == reason


def test_errors_never_carry_the_token_or_the_contact():
    transport = _Transport([(401, b'{"message":"bad token"}')])

    with pytest.raises(CrmError) as error:
        _client(transport).send_contact(CONTACT)

    text = f"{error.value} {error.value.describe()} {error.value.reason} {error.value!r}"
    assert TOKEN not in text
    assert "ana.perez@example.com" not in text


# --- the real transport, against a local server (never GoHighLevel) -----------


class _Handler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):  # noqa: N802
        if self.path == "/redirect":
            self.send_response(302)
            self.send_header("Location", "http://127.0.0.1:1/elsewhere")
            self.end_headers()
        elif self.path == "/slow":
            time.sleep(1.0)
            self.send_response(201)
            self.end_headers()
        else:
            body = b'{"ok": true}'
            self.send_response(201)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    def log_message(self, *args):
        pass


@pytest.fixture()
def local_server():
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), _Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{server.server_address[1]}"
    server.shutdown()
    server.server_close()


def _post(url: str) -> urllib.request.Request:
    return urllib.request.Request(url, data=b"{}", method="POST")


def test_transport_returns_status_and_body(local_server):
    assert _https_transport(_post(local_server + "/ok"), 2.0) == (201, b'{"ok": true}')


def test_transport_does_not_follow_redirects(local_server):
    # A redirect could carry the Authorization header to another host.
    status, _ = _https_transport(_post(local_server + "/redirect"), 2.0)

    assert status == 302


def test_transport_times_out(local_server):
    with pytest.raises(CrmError) as error:
        _https_transport(_post(local_server + "/slow"), 0.2)

    assert error.value.reason == "timeout"


def test_transport_reports_a_connection_failure():
    with pytest.raises(CrmError) as error:
        _https_transport(_post("http://127.0.0.1:1/"), 1.0)

    assert error.value.reason == "network"
