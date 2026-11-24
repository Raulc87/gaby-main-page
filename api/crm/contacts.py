"""What is sent to GoHighLevel for a saved lead (LEAD_API_CONTRACT.md section 12).

A contact is built from the stored row, not from the request, so the live
save and the resend command (crm/resend.py) send exactly the same thing.
Rows read back from the sheet carry text ("TRUE", "4.43"), rows just saved
carry the normalized values; the builders accept both.

Nothing outside the contract's table is ever put in a contact: no figures
from the calculator, no IP address, no honeypot value.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from decimal import ROUND_HALF_UP, Decimal

from crm.errors import CrmError

TAG_CALCULATOR = "lead-calculadora"
TAG_MARKETING_CONSENT = "consentimiento-correos"
TAG_VIP_APPLICATION = "aplicacion-vip"
LANGUAGE_TAGS = {"es": "idioma-es", "en": "idioma-en"}

FIELD_MESES = "meses"
FIELD_ZONA = "zona"
FIELD_MONEDA = "moneda"
FIELD_ALERTA_CONCENTRACION = "alerta_concentracion"
FIELD_PRESELECCION = "preseleccion"

# Spanish labels of the zones (contract section 12, "zona").
ZONE_LABELS_ES = {
    "critical": "Zona crítica",
    "alert": "Zona de alerta",
    "building": "Base en construcción",
    "path_to_freedom": "Camino a la libertad",
    "solid_cushion": "Colchón sólido",
    "financially_free": "Libre financieramente",
}

# Spanish text of the screening answers: docs/ux/CONTENT.md `form.screening.*`
# (api/tests/test_crm_contacts.py checks these against that file).
SCREENING_ANSWER_LABELS_ES = {
    "ready_to_invest": "Quiero invertir si el programa es adecuado para mí.",
    "needs_investment_info": "Tengo disposición, pero necesito conocer la inversión primero.",
    "no_capacity_now": "Me interesa, pero actualmente no tengo capacidad para invertir.",
    "exploring": "Solo estoy explorando por ahora.",
}

# Gaby's display rule (PROJECT_SPEC.md FR-034): below 10 months, rounded to
# the nearest tenth; from 10, to the nearest whole number.
WHOLE_NUMBER_FROM_MONTHS = Decimal(10)
ONE_DECIMAL = Decimal("0.1")
WHOLE = Decimal(1)


@dataclass(frozen=True)
class Contact:
    """A GoHighLevel contact as the site sends it.

    `custom_fields` is keyed by the field's name in the contract (`meses`,
    `zona`, ...); the client maps each name to the id Gaby's account uses.
    """

    name: str
    email: str
    phone: str = ""
    tags: tuple[str, ...] = ()
    custom_fields: dict[str, str] = field(default_factory=dict)


def months_as_shown(stored_months: str | float | int | None) -> str:
    """The months as the visitor saw them, in Spanish ("4,5", "10", "" when none).

    Ties round half up on the exact decimal value, never on binary floating
    point: 9.95 -> "10", 4.45 -> "4,5", 10.5 -> "11".
    """
    if stored_months is None or str(stored_months).strip() == "":
        return ""
    months = Decimal(str(stored_months))
    if months >= WHOLE_NUMBER_FROM_MONTHS:
        return str(months.quantize(WHOLE, rounding=ROUND_HALF_UP))
    rounded = months.quantize(ONE_DECIMAL, rounding=ROUND_HALF_UP)
    if rounded == rounded.to_integral_value():
        return str(rounded.quantize(WHOLE))
    return str(rounded).replace(".", ",")


def _as_bool(value: object) -> bool:
    if isinstance(value, bool):
        return value
    return str(value).strip().upper() == "TRUE"


def _language_tag(row: dict) -> str:
    try:
        return LANGUAGE_TAGS[row["language"]]
    except KeyError:
        raise CrmError("invalid_row") from None


def calculator_contact(row: dict) -> Contact:
    """Contact for a calculator lead row (contract section 11.5)."""
    try:
        zone_label = ZONE_LABELS_ES[row["zone"]]
    except KeyError:
        raise CrmError("invalid_row") from None

    tags = [TAG_CALCULATOR, _language_tag(row)]
    if _as_bool(row.get("marketing_consent")):
        tags.append(TAG_MARKETING_CONSENT)

    return Contact(
        name=row["name"],
        email=row["email"],
        phone=row.get("phone") or "",
        tags=tuple(tags),
        custom_fields={
            FIELD_MESES: months_as_shown(row.get("months")),
            FIELD_ZONA: zone_label,
            FIELD_MONEDA: row["currency"],
            FIELD_ALERTA_CONCENTRACION: "sí" if _as_bool(row.get("concentration_alert")) else "no",
        },
    )


def vip_contact(row: dict) -> Contact:
    """Contact for a Wealth Mastery application row (contract section 6)."""
    try:
        screening_text = SCREENING_ANSWER_LABELS_ES[row["screening_answer"]]
    except KeyError:
        raise CrmError("invalid_row") from None

    return Contact(
        name=row["name"],
        email=row["email"],
        phone=row.get("phone") or "",
        tags=(TAG_VIP_APPLICATION, _language_tag(row)),
        custom_fields={FIELD_PRESELECCION: screening_text},
    )
