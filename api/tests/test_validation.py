"""Field validation rules per LEAD_API_CONTRACT.md sections 3, 4, and 8.

At least one valid and one invalid case per field/rule, using the contract's
own example values.
"""

from __future__ import annotations

import pytest

from validation import validate_lead

VALID_PAYLOAD = {
    "name": "Ana Maria Perez Soto",
    "email": "ana.perez@example.com",
    "phone": "+50684104791",
    "screening_answer": "needs_investment_info",
    "language": "es",
    "consent": True,
}


def _with(**overrides):
    payload = dict(VALID_PAYLOAD)
    payload.update(overrides)
    return payload


def test_valid_payload_has_no_errors():
    normalized, errors = validate_lead(VALID_PAYLOAD)

    assert errors == {}
    assert normalized == {
        "name": "Ana Maria Perez Soto",
        "email": "ana.perez@example.com",
        "phone": "+50684104791",
        "screening_answer": "needs_investment_info",
        "language": "es",
        "consent": True,
    }


# --- name -------------------------------------------------------------


def test_name_missing_is_required():
    payload = dict(VALID_PAYLOAD)
    del payload["name"]

    _, errors = validate_lead(payload)

    assert errors["name"] == "required"


@pytest.mark.parametrize("value", [None, "", "   "])
def test_name_null_or_blank_is_required(value):
    _, errors = validate_lead(_with(name=value))

    assert errors["name"] == "required"


def test_name_wrong_type_is_invalid_type():
    _, errors = validate_lead(_with(name=12345))

    assert errors["name"] == "invalid_type"


def test_name_too_short_after_normalization():
    _, errors = validate_lead(_with(name="Al"))

    assert errors["name"] == "too_short"


def test_name_too_long():
    _, errors = validate_lead(_with(name="Ana " + "a" * 100))

    assert errors["name"] == "too_long"


def test_name_disallowed_characters():
    _, errors = validate_lead(_with(name="Ana Perez2"))

    assert errors["name"] == "invalid_characters"


def test_name_allows_accents_and_punctuation():
    normalized, errors = validate_lead(_with(name="Ñoño D'Ángelo-Ruíz Ütz"))

    assert errors == {}
    assert normalized["name"] == "Ñoño D'Ángelo-Ruíz Ütz"


def test_name_single_word_requires_full_name():
    _, errors = validate_lead(_with(name="Anabel"))

    assert errors["name"] == "full_name_required"


def test_name_collapses_internal_whitespace():
    normalized, errors = validate_lead(_with(name="  Ana   Perez  "))

    assert errors == {}
    assert normalized["name"] == "Ana Perez"


# --- email --------------------------------------------------------------


def test_email_missing_is_required():
    payload = dict(VALID_PAYLOAD)
    del payload["email"]

    _, errors = validate_lead(payload)

    assert errors["email"] == "required"


def test_email_wrong_type_is_invalid_type():
    _, errors = validate_lead(_with(email=12345))

    assert errors["email"] == "invalid_type"


def test_email_too_long():
    local_part = "a" * 65
    _, errors = validate_lead(_with(email=f"{local_part}@example.com"))

    assert errors["email"] == "too_long"


def test_email_invalid_format():
    _, errors = validate_lead(_with(email="not-an-email"))

    assert errors["email"] == "invalid_format"


def test_email_local_part_cannot_start_with_dot():
    _, errors = validate_lead(_with(email=".ana@example.com"))

    assert errors["email"] == "invalid_format"


def test_email_local_part_cannot_contain_consecutive_dots():
    _, errors = validate_lead(_with(email="ana..perez@example.com"))

    assert errors["email"] == "invalid_format"


def test_email_is_normalized_to_lowercase_and_trimmed():
    normalized, errors = validate_lead(_with(email="  Ana.Perez@Example.COM "))

    assert errors == {}
    assert normalized["email"] == "ana.perez@example.com"


# --- phone ----------------------------------------------------------------


def test_phone_missing_is_required():
    payload = dict(VALID_PAYLOAD)
    del payload["phone"]

    _, errors = validate_lead(payload)

    assert errors["phone"] == "required"


def test_phone_wrong_type_is_invalid_type():
    _, errors = validate_lead(_with(phone=50684104791))

    assert errors["phone"] == "invalid_type"


@pytest.mark.parametrize(
    "value",
    [
        "84104791",  # missing country code / +
        "+1234567",  # too few digits
        "+1234567890123456",  # too many digits
        "+50684abc4791",  # letters
    ],
)
def test_phone_invalid_format(value):
    _, errors = validate_lead(_with(phone=value))

    assert errors["phone"] == "invalid_format"


def test_phone_strips_spaces_hyphens_parens_and_periods():
    normalized, errors = validate_lead(_with(phone="+(506) 8410-47.91"))

    assert errors == {}
    assert normalized["phone"] == "+50684104791"


# --- screening_answer -------------------------------------------------


def test_screening_answer_missing_is_required():
    payload = dict(VALID_PAYLOAD)
    del payload["screening_answer"]

    _, errors = validate_lead(payload)

    assert errors["screening_answer"] == "required"


def test_screening_answer_wrong_type_is_invalid_type():
    _, errors = validate_lead(_with(screening_answer=True))

    assert errors["screening_answer"] == "invalid_type"


def test_screening_answer_invalid_option():
    _, errors = validate_lead(_with(screening_answer="not_a_real_code"))

    assert errors["screening_answer"] == "invalid_option"


@pytest.mark.parametrize(
    "code",
    ["ready_to_invest", "needs_investment_info", "no_capacity_now", "exploring"],
)
def test_screening_answer_accepts_every_contract_code(code):
    normalized, errors = validate_lead(_with(screening_answer=code))

    assert errors == {}
    assert normalized["screening_answer"] == code


# --- language -------------------------------------------------------------


def test_language_missing_is_required():
    payload = dict(VALID_PAYLOAD)
    del payload["language"]

    _, errors = validate_lead(payload)

    assert errors["language"] == "required"


def test_language_wrong_type_is_invalid_type():
    _, errors = validate_lead(_with(language=1))

    assert errors["language"] == "invalid_type"


def test_language_invalid_option():
    _, errors = validate_lead(_with(language="fr"))

    assert errors["language"] == "invalid_option"


@pytest.mark.parametrize("code", ["es", "en"])
def test_language_accepts_es_and_en(code):
    normalized, errors = validate_lead(_with(language=code))

    assert errors == {}
    assert normalized["language"] == code


# --- consent ----------------------------------------------------------------


def test_consent_missing_is_required():
    payload = dict(VALID_PAYLOAD)
    del payload["consent"]

    _, errors = validate_lead(payload)

    assert errors["consent"] == "required"


def test_consent_null_is_required():
    _, errors = validate_lead(_with(consent=None))

    assert errors["consent"] == "required"


def test_consent_wrong_type_is_invalid_type():
    _, errors = validate_lead(_with(consent="true"))

    assert errors["consent"] == "invalid_type"


def test_consent_false_is_consent_required():
    _, errors = validate_lead(_with(consent=False))

    assert errors["consent"] == "consent_required"


def test_consent_true_is_valid():
    normalized, errors = validate_lead(_with(consent=True))

    assert errors == {}
    assert normalized["consent"] is True


# --- multiple fields --------------------------------------------------------


def test_multiple_invalid_fields_are_all_reported():
    _, errors = validate_lead(_with(name="Ana", phone="not-a-phone"))

    assert errors == {"name": "full_name_required", "phone": "invalid_format"}


def test_unknown_fields_are_ignored():
    normalized, errors = validate_lead(_with(unexpected="ignored"))

    assert errors == {}
    assert "unexpected" not in normalized
