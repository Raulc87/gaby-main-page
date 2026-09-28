"""Unit tests for the sliding-window limiter (LEAD_API_CONTRACT.md section 3.2)."""

from __future__ import annotations

import threading

from rate_limit import RateLimiter


def test_allows_up_to_max_requests_within_window():
    limiter = RateLimiter(max_requests=3, window_seconds=60, clock=lambda: 0.0)

    results = [limiter.check("1.2.3.4") for _ in range(3)]

    assert all(allowed for allowed, _ in results)


def test_rejects_request_over_the_limit():
    limiter = RateLimiter(max_requests=1, window_seconds=60, clock=lambda: 0.0)

    limiter.check("1.2.3.4")
    allowed, retry_after = limiter.check("1.2.3.4")

    assert allowed is False
    assert retry_after == 60


def test_retry_after_is_rounded_up_and_at_least_one_second():
    now = [0.0]
    limiter = RateLimiter(max_requests=1, window_seconds=60, clock=lambda: now[0])

    limiter.check("1.2.3.4")
    now[0] = 59.2
    allowed, retry_after = limiter.check("1.2.3.4")

    assert allowed is False
    assert retry_after == 1  # ceil(0 + 60 - 59.2) == ceil(0.8) == 1


def test_rejected_request_is_not_counted():
    now = [0.0]
    limiter = RateLimiter(max_requests=1, window_seconds=60, clock=lambda: now[0])

    limiter.check("1.2.3.4")
    limiter.check("1.2.3.4")  # rejected: must not be counted
    now[0] = 60.0  # the one counted request now exactly leaves the window
    allowed, retry_after = limiter.check("1.2.3.4")

    assert allowed is True
    assert retry_after == 0


def test_window_expiry_drops_old_entries():
    now = [0.0]
    limiter = RateLimiter(max_requests=1, window_seconds=60, clock=lambda: now[0])

    limiter.check("1.2.3.4")
    now[0] = 61.0

    allowed, retry_after = limiter.check("1.2.3.4")

    assert allowed is True
    assert retry_after == 0


def test_disabled_when_max_requests_is_zero():
    limiter = RateLimiter(max_requests=0, window_seconds=60, clock=lambda: 0.0)

    results = [limiter.check("1.2.3.4") for _ in range(100)]

    assert all(allowed for allowed, _ in results)
    assert all(retry_after == 0 for _, retry_after in results)


def test_limits_are_independent_per_key():
    limiter = RateLimiter(max_requests=1, window_seconds=60, clock=lambda: 0.0)

    first_allowed, _ = limiter.check("1.1.1.1")
    second_allowed, _ = limiter.check("2.2.2.2")

    assert first_allowed is True
    assert second_allowed is True


def test_inactive_key_is_evicted_once_its_window_expires():
    now = [0.0]
    limiter = RateLimiter(max_requests=5, window_seconds=600, clock=lambda: now[0])

    limiter.check("1.2.3.4")
    assert "1.2.3.4" in limiter._requests

    # 1.2.3.4 never comes back; a different client's check must still
    # sweep it out once its window has passed (LEAD_API_CONTRACT.md
    # section 3.2: dropped "once they all expire", not only when the
    # same key is checked again).
    now[0] = 600.1
    limiter.check("5.6.7.8")

    assert "1.2.3.4" not in limiter._requests
    assert "5.6.7.8" in limiter._requests


def test_many_inactive_keys_do_not_accumulate_without_bound():
    now = [0.0]
    limiter = RateLimiter(max_requests=5, window_seconds=600, clock=lambda: now[0])

    for i in range(1000):
        limiter.check(f"10.0.{i // 256}.{i % 256}")

    now[0] = 10_000.0  # well past every one of those keys' window
    limiter.check("192.0.2.1")

    assert list(limiter._requests) == ["192.0.2.1"]


def test_partial_expiry_keeps_only_the_still_valid_timestamps():
    now = [0.0]
    limiter = RateLimiter(max_requests=2, window_seconds=10, clock=lambda: now[0])

    limiter.check("1.2.3.4")  # t=0, expires at t=10
    now[0] = 5.0
    limiter.check("1.2.3.4")  # t=5, expires at t=15

    now[0] = 11.0  # the t=0 request has left the window, t=5 has not
    allowed, _ = limiter.check("1.2.3.4")  # only one prior timestamp counts

    assert allowed is True
    assert limiter._requests["1.2.3.4"] == [5.0, 11.0]


def test_thread_safe_under_concurrent_access():
    limiter = RateLimiter(max_requests=50, window_seconds=60, clock=lambda: 0.0)
    accepted = []
    lock = threading.Lock()

    def worker():
        allowed, _ = limiter.check("1.2.3.4")
        if allowed:
            with lock:
                accepted.append(1)

    threads = [threading.Thread(target=worker) for _ in range(200)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    assert len(accepted) == 50
