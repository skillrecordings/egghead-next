# Session-Based Logging Rule

**Your Task: Implement structured logging so each application run writes to a separate file in the `logs/` directory.**

## File Existence Check

Verify logging directory and ignore file:

```bash
ls logs .gitignore
```

Create missing items if necessary before proceeding.

## I. Directory & Git Ignore

1. Ensure a `logs/` directory exists at the project root. Create it if missing.
2. Confirm `logs` (or `logs/`) is listed in `.gitignore` so log files are never committed.

## II. Log File Per Run

1. On startup, generate a timestamp `YYYY-MM-DD-HH-MM-SS`.
2. Create a new file `logs/<timestamp>.log` and append all log output to it.
3. Subsequent runs create new files, preserving previous logs for reference.

## III. Log Content

- Use a logger like `pino` or `winston`, or simple file writes if unavailable.
- Record start and end of major operations, successful paths, handled errors, and unexpected failures.
- Include relevant environment info such as CLI arguments and Node version.

## IV. Toggle Mechanism

- Logging is enabled by default.
- Provide an environment variable `LOG_LEVEL=off` or a command-line flag `--no-log` to disable file logging.
- When disabled, skip creating the log file and suppress log output.

## V. AI-Friendly Format

- Prefer structured lines (JSON or clearly delimited text) for easy ingestion by debugging tools and AI systems.
- Each entry should include level, timestamp, and message.

**REMEMBER: Logs must capture both happy paths and errors. Maintain readability while providing enough detail for effective troubleshooting.**
