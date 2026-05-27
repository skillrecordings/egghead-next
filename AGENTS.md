# Agent Notes

## Logging

- Do not add direct `console.*` logging in application code. Use the shared structured logger from `src/utils/structured-log.ts`.
- Runtime skip, fallback, and handled-error paths should emit structured `logEvent(...)` entries with stable event names and object payloads.
- Logging must respect `LOG_LEVEL=off` and `--no-log`; when disabled, suppress log output.
