"""Server-side field validation per LEAD_API_CONTRACT.md sections 3, 4, and 8.

`validate_lead` returns a (normalized_fields, field_errors) pair. When
field_errors is empty, normalized_fields carries every request field ready
to store; the caller adds the server-generated fields (submitted_at,
privacy_notice_version, status).
"""

from __future__ import annotations

import re

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


def _validate_phone(payload: dict, normalized: dict, errors: dict) -> None:
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
