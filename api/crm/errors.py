from __future__ import annotations


class CrmError(Exception):
    """A contact could not be sent to GoHighLevel.

    `reason` is a short code that is safe to log (`not_configured`, `timeout`,
    `network`, `http_error`, `invalid_row`); `status_code` is GoHighLevel's HTTP
    status for `http_error`. The message never carries request data or the token.
    """

    def __init__(self, reason: str, status_code: int | None = None) -> None:
        super().__init__(reason)
        self.reason = reason
        self.status_code = status_code

    def describe(self) -> str:
        if self.status_code is None:
            return self.reason
        return f"{self.reason} {self.status_code}"
