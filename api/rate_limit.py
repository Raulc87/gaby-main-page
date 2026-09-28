"""Per-IP sliding-window rate limiter (LEAD_API_CONTRACT.md section 3.2, ADR-004).

Thread-safe, in-memory only: a Passenger process may serve requests on more
than one thread, and ADR-004 accepts that counters are per process (reset on
restart, not shared across processes). An IP address and the times of its
counted requests are held only while at least one of those requests is
still inside the window, and are dropped once they all expire. Nothing here
is logged, written to a file, or persisted anywhere else.
"""

from __future__ import annotations

import math
import threading
import time
from typing import Callable

Clock = Callable[[], float]


class RateLimiter:
    def __init__(
        self,
        max_requests: int,
        window_seconds: float,
        clock: Clock = time.monotonic,
    ) -> None:
        self._max_requests = max_requests
        self._window_seconds = window_seconds
        self._clock = clock
        self._lock = threading.Lock()
        self._requests: dict[str, list[float]] = {}

    @property
    def enabled(self) -> bool:
        return self._max_requests > 0

    def check(self, key: str) -> tuple[bool, int]:
        """Count a request for `key` if it is within the limit.

        Returns (allowed, retry_after_seconds). When allowed, this call's
        request is counted immediately. When not allowed, nothing is
        counted and retry_after_seconds is the whole number of seconds
        (rounded up, at least 1) until the oldest counted request leaves
        the window.
        """
        if not self.enabled:
            return True, 0

        now = self._clock()
        cutoff = now - self._window_seconds

        with self._lock:
            timestamps = [t for t in self._requests.get(key, ()) if t > cutoff]

            if len(timestamps) >= self._max_requests:
                retry_after = max(1, math.ceil(timestamps[0] + self._window_seconds - now))
                if timestamps:
                    self._requests[key] = timestamps
                else:
                    self._requests.pop(key, None)
                return False, retry_after

            timestamps.append(now)
            self._requests[key] = timestamps
            return True, 0
