"""Server-side field validation per LEAD_API_CONTRACT.md sections 3, 4, and 8.

`validate_lead` returns a (normalized_fields, field_errors) pair. When
field_errors is empty, normalized_fields carries every request field ready
to store; the caller adds the server-generated fields (submitted_at,
privacy_notice_version, status).
"""

from __future__ import annotations

import re
from decimal import Decimal, InvalidOperation

NAME_MIN_LENGTH = 3
NAME_MAX_LENGTH = 100
NAME_ALLOWED_EXTRA_CHARS = " '’-."  # space, ' and curly apostrophe, hyphen, period

EMAIL_MAX_LENGTH = 254
EMAIL_LOCAL_MAX_LENGTH = 64
EMAIL_PATTERN = re.compile(
    r"^[a-z0-9._%+-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?"
    r"(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,63}$"
)

PHONE_STRIP_PATTERN = re.compile(r"[ \-().]")
PHONE_PATTERN = re.compile(r"^\+[1-9][0-9]{7,14}$")

SCREENING_ANSWER_CODES = frozenset(
    {
        "ready_to_invest",
        "needs_investment_info",
        "no_capacity_now",
        "exploring",
    }
)
LANGUAGE_CODES = frozenset({"es", "en"})

# LEAD_API_CONTRACT.md section 11.2: zones and the months that bound them.
ZONE_CODES = frozenset({"alert", "building", "freedom"})
BUILDING_ZONE_MIN_MONTHS = Decimal(6)
FREEDOM_ZONE_MIN_MONTHS = Decimal(12)
MONTHS_MAX_DECIMAL_PLACES = 1


def validate_lead(payload: dict) -> tuple[dict, dict]:
    normalized: dict = {}
    errors: dict = {}

    _validate_name(payload, normalized, errors)
    _validate_email(payload, normalized, errors)
    _validate_phone(payload, normalized, errors)
    _validate_choice(payload, normalized, errors, "screening_answer", SCREENING_ANSWER_CODES)
    _validate_choice(payload, normalized, errors, "language", LANGUAGE_CODES)
    _validate_consent(payload, normalized, errors)

    return normalized, errors


def validate_calculator_lead(payload: dict) -> tuple[dict, dict]:
    """Validate a calculator lead (LEAD_API_CONTRACT.md sections 11.2, 11.3).

    Fields outside the contract (such as the five figures the visitor typed)
    are never copied into `normalized`, so they can never be stored.
    """
    normalized: dict = {}
    errors: dict = {}

    _validate_name(payload, normalized, errors)
    _validate_email(payload, normalized, errors)
    _validate_phone(payload, normalized, errors, required=False)
    _validate_choice(payload, normalized, errors, "language", LANGUAGE_CODES)
    _validate_consent(payload, normalized, errors)
    _validate_marketing_consent(payload, normalized, errors)
    months = _validate_months(payload, normalized, errors)
    _validate_zone(payload, normalized, errors, months)

    return normalized, errors


def _get_required_string(payload: dict, field: str, errors: dict) -> str | None:
    value = payload.get(field)
    if value is None:
        errors[field] = "required"
        return None
    if not isinstance(value, str):
        errors[field] = "invalid_type"
        return None
    if value.strip() == "":
        errors[field] = "required"
        return None
    return value


def _validate_name(payload: dict, normalized: dict, errors: dict) -> None:
    value = _get_required_string(payload, "name", errors)
    if value is None:
        return

    collapsed = re.sub(r"\s+", " ", value.strip())

    if len(collapsed) < NAME_MIN_LENGTH:
        errors["name"] = "too_short"
        return
    if len(collapsed) > NAME_MAX_LENGTH:
        errors["name"] = "too_long"
        return
    if not all(ch.isalpha() or ch in NAME_ALLOWED_EXTRA_CHARS for ch in collapsed):
        errors["name"] = "invalid_characters"
        return

    words = collapsed.split(" ")
    if len(words) < 2 or not all(word[:1].isalpha() for word in words):
        errors["name"] = "full_name_required"
        return

    normalized["name"] = collapsed


def _validate_email(payload: dict, normalized: dict, errors: dict) -> None:
    value = _get_required_string(payload, "email", errors)
    if value is None:
        return

    candidate = value.strip().lower()
    local_part = candidate.split("@", 1)[0]

    if len(candidate) > EMAIL_MAX_LENGTH or len(local_part) > EMAIL_LOCAL_MAX_LENGTH:
        errors["email"] = "too_long"
        return
    if not EMAIL_PATTERN.match(candidate):
        errors["email"] = "invalid_format"
        return
    if local_part.startswith(".") or local_part.endswith(".") or ".." in local_part:
        errors["email"] = "invalid_format"
        return

    normalized["email"] = candidate


def _validate_phone(
    payload: dict, normalized: dict, errors: dict, required: bool = True
) -> None:
    if not required and _is_blank_optional_string(payload.get("phone")):
        normalized["phone"] = ""
        return

    value = _get_required_string(payload, "phone", errors)
    if value is None:
        return

    candidate = PHONE_STRIP_PATTERN.sub("", value)
    if not PHONE_PATTERN.match(candidate):
        errors["phone"] = "invalid_format"
        return

    normalized["phone"] = candidate


def _validate_choice(
    payload: dict, normalized: dict, errors: dict, field: str, allowed_codes: frozenset
) -> None:
    value = _get_required_string(payload, field, errors)
    if value is None:
        return
    if value not in allowed_codes:
        errors[field] = "invalid_option"
        return
    normalized[field] = value


def _validate_consent(payload: dict, normalized: dict, errors: dict) -> None:
    if "consent" not in payload or payload["consent"] is None:
        errors["consent"] = "required"
        return

    value = payload["consent"]
    if not isinstance(value, bool):
        errors["consent"] = "invalid_type"
        return
    if value is not True:
        errors["consent"] = "consent_required"
        return

    normalized["consent"] = True


def _is_blank_optional_string(value: object) -> bool:
    """True for an optional string field left empty: null or blank text."""
    return value is None or (isinstance(value, str) and value.strip() == "")


def _validate_marketing_consent(payload: dict, normalized: dict, errors: dict) -> None:
    value = payload.get("marketing_consent", False)
    if not isinstance(value, bool):
        errors["marketing_consent"] = "invalid_type"
        return
    normalized["marketing_consent"] = value


def _validate_months(payload: dict, normalized: dict, errors: dict) -> Decimal | None:
    """Validate `months`; returns it as a Decimal, or None when it is null or invalid.

    `normalized["months"]` is the text to store: one decimal and a point
    (section 11.2), or "" when the months are null ("covered").
    """
    if "months" not in payload:
        errors["months"] = "required"
        return None

    value = payload["months"]
    if value is None:
        normalized["months"] = ""
        return None
    # bool is an int in Python, but JSON true/false is not a number.
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        errors["months"] = "invalid_type"
        return None

    try:
        months = Decimal(repr(value)).normalize()
    except InvalidOperation:
        errors["months"] = "invalid_format"
        return None
    if not months.is_finite() or months < 0:
        errors["months"] = "invalid_format"
        return None
    if months.as_tuple().exponent < -MONTHS_MAX_DECIMAL_PLACES:
        errors["months"] = "invalid_format"
        return None

    if months.is_zero():
        months = Decimal(0)  # JSON -0.0 would otherwise be stored as "-0.0"
    normalized["months"] = f"{months:.{MONTHS_MAX_DECIMAL_PLACES}f}"
    return months


def _expected_zone(months: Decimal | None) -> str:
    if months is None or months >= FREEDOM_ZONE_MIN_MONTHS:
        return "freedom"
    if months >= BUILDING_ZONE_MIN_MONTHS:
        return "building"
    return "alert"


def _validate_zone(
    payload: dict, normalized: dict, errors: dict, months: Decimal | None
) -> None:
    _validate_choice(payload, normalized, errors, "zone", ZONE_CODES)
    if "zone" not in normalized:
        return
    # `months` that failed its own validation has no zone to compare with;
    # null months mean "covered", which is the freedom zone.
    if "months" in errors:
        return
    if normalized["zone"] != _expected_zone(months):
        errors["zone"] = "zone_mismatch"
        del normalized["zone"]
