"""What is sent to GoHighLevel (LEAD_API_CONTRACT.md section 12, "What is sent")."""

from __future__ import annotations

import re
from pathlib import Path

import pytest

from crm.contacts import (
    SCREENING_ANSWER_LABELS_ES,
    ZONE_LABELS_ES,
    calculator_contact,
    months_as_shown,
    vip_contact,
)
from crm.errors import CrmError
from validation import ZONE_CODES

CONTENT_FILE = Path(__file__).resolve().parents[2] / "docs" / "ux" / "CONTENT.md"

CALCULATOR_ROW = {
    "submitted_at": "24/11/2026 10:00:00",
    "name": "Ana María Pérez Soto",
    "email": "ana.perez@example.com",
    "phone": "",
    "language": "es",
    "months": "4.43",
    "zone": "alert",
    "consent": True,
    "marketing_consent": False,
    "source": "calculator",
    "privacy_notice_version": "2026-11-draft-4",
    "status": "started",
    "currency": "USD",
    "concentration_alert": True,
    "crm_status": "pending",
}

VIP_ROW = {
    "submitted_at": "24/11/2026 10:00:00",
    "name": "Ana Perez",
    "email": "ana.perez@example.com",
    "phone": "+50684104791",
    "screening_answer": "needs_investment_info",
    "language": "en",
    "consent": True,
    "privacy_notice_version": "2026-11-draft-4",
    "status": "started",
    "crm_status": "pending",
}


# --- `meses`: Gaby's display rule, half up on the exact decimal ---------------


@pytest.mark.parametrize(
    ("stored_months", "shown"),
    [
        ("4.45", "4,5"),  # contract: written 4,5 in Spanish
        ("9.95", "10"),
        ("9.96", "10"),
        ("10.49", "10"),
        ("10.50", "11"),
        ("0.00", "0"),
        ("4.43", "4,4"),
        ("4.40", "4,4"),
        ("5.96", "6"),  # a whole value is written without a decimal
        ("6.00", "6"),
        ("9.94", "9,9"),
        ("0.05", "0,1"),
        ("0.04", "0"),
        ("12.34", "12"),
        ("1234.50", "1235"),
        ("100000000000000000000.00", "100000000000000000000"),
        ("", ""),
        (None, ""),
    ],
)
def test_months_as_shown(stored_months, shown):
    assert months_as_shown(stored_months) == shown


def test_months_ties_never_use_binary_floating_point():
    # 4.45 and 2.65 are slightly below their decimal value in binary floating
    # point, so Python's round() gives 4.4 and 2.6; half up on the decimal
    # value gives 4.5 and 2.7.
    assert months_as_shown("4.45") == "4,5"
    assert months_as_shown("2.65") == "2,7"


# --- calculator contact --------------------------------------------------------


def test_calculator_contact_has_the_fields_of_the_contract():
    contact = calculator_contact(CALCULATOR_ROW)

    assert contact.name == "Ana María Pérez Soto"
    assert contact.email == "ana.perez@example.com"
    assert contact.phone == ""
    assert contact.tags == ("lead-calculadora", "idioma-es")
    assert contact.custom_fields == {
        "meses": "4,4",
        "zona": "Zona de alerta",
        "moneda": "USD",
        "alerta_concentracion": "sí",
    }


def test_calculator_contact_carries_the_phone_when_given():
    assert calculator_contact({**CALCULATOR_ROW, "phone": "+50684104791"}).phone == "+50684104791"


def test_consent_tag_only_with_marketing_consent():
    without = calculator_contact({**CALCULATOR_ROW, "marketing_consent": False})
    with_consent = calculator_contact({**CALCULATOR_ROW, "marketing_consent": True})

    assert "consentimiento-correos" not in without.tags
    assert with_consent.tags == ("lead-calculadora", "idioma-es", "consentimiento-correos")


def test_language_tag_follows_the_language():
    assert calculator_contact({**CALCULATOR_ROW, "language": "en"}).tags[1] == "idioma-en"


def test_months_null_gives_an_empty_meses_and_the_financially_free_zone():
    contact = calculator_contact({**CALCULATOR_ROW, "months": "", "zone": "financially_free"})

    assert contact.custom_fields["meses"] == ""
    assert contact.custom_fields["zona"] == "Libre financieramente"


@pytest.mark.parametrize("concentration_alert", [False, "FALSE"])
def test_alerta_concentracion_no(concentration_alert):
    contact = calculator_contact({**CALCULATOR_ROW, "concentration_alert": concentration_alert})

    assert contact.custom_fields["alerta_concentracion"] == "no"


def test_a_row_read_back_from_the_sheet_gives_the_same_contact():
    # The sheet returns text: TRUE/FALSE, "4.43", an empty phone.
    from_sheet = {
        **CALCULATOR_ROW,
        "consent": "TRUE",
        "marketing_consent": "TRUE",
        "concentration_alert": "TRUE",
    }

    assert calculator_contact(from_sheet) == calculator_contact(
        {**CALCULATOR_ROW, "marketing_consent": True}
    )


def test_every_zone_has_its_spanish_label():
    assert set(ZONE_LABELS_ES) == ZONE_CODES
    assert ZONE_LABELS_ES == {
        "critical": "Zona crítica",
        "alert": "Zona de alerta",
        "building": "Base en construcción",
        "path_to_freedom": "Camino a la libertad",
        "solid_cushion": "Colchón sólido",
        "financially_free": "Libre financieramente",
    }


def test_nothing_else_is_sent_from_the_row():
    row = {**CALCULATOR_ROW, "monthly_expenses": "1500", "website": "x", "ip": "10.0.0.1"}

    contact = calculator_contact(row)

    sent = repr(contact)
    assert "1500" not in sent
    assert "10.0.0.1" not in sent


@pytest.mark.parametrize("field, value", [("zone", "freedom"), ("zone", ""), ("language", "fr")])
def test_a_row_the_contract_does_not_describe_is_rejected(field, value):
    with pytest.raises(CrmError) as error:
        calculator_contact({**CALCULATOR_ROW, field: value})

    assert error.value.reason == "invalid_row"


# --- Wealth Mastery application contact -----------------------------------------


def test_vip_contact_has_the_fields_of_the_contract():
    contact = vip_contact(VIP_ROW)

    assert contact.name == "Ana Perez"
    assert contact.email == "ana.perez@example.com"
    assert contact.phone == "+50684104791"
    assert contact.tags == ("aplicacion-vip", "idioma-en")
    assert contact.custom_fields == {
        "preseleccion": "Tengo disposición, pero necesito conocer la inversión primero."
    }


def test_vip_contact_never_gets_the_consent_or_calculator_fields():
    contact = vip_contact(VIP_ROW)

    assert "consentimiento-correos" not in contact.tags
    assert "lead-calculadora" not in contact.tags
    assert set(contact.custom_fields) == {"preseleccion"}


def test_vip_row_with_an_unknown_screening_answer_is_rejected():
    with pytest.raises(CrmError):
        vip_contact({**VIP_ROW, "screening_answer": "maybe"})


def test_screening_texts_are_the_spanish_copy_of_content_md():
    """The CRM gets the Spanish text of `form.screening.*` (contract section 12)."""
    content = CONTENT_FILE.read_text(encoding="utf-8")
    for code, text in SCREENING_ANSWER_LABELS_ES.items():
        row = re.search(rf"^\| `form\.screening\.{code}` \| (.+?) \| .+? \| \w+ \|$", content, re.M)
        assert row, f"form.screening.{code} is not in CONTENT.md"
        assert row.group(1) == text
