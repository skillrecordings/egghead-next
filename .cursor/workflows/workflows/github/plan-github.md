# Create a GitHub Issue Task Plan

**Your Core Task: Generate a multi-commit task plan and post it as a GitHub issue using the `gh` CLI. The issue body must contain the entire plan. No local task file is created.**

## File Existence Check

Verify key documentation files before planning:

```bash
ls . docs
```

Use the results to tailor the task plan.

## I. Pre-computation: Capture Timestamp

1.  **Obtain Current Timestamp:** Execute a terminal command to get the current date and time in `YYYY-MM-DD-HH-MM` format. (Example for Linux/macOS: `date +"%Y-%m-%d-%H-%M"`).
2.  **Formulate Issue Title:** Use this timestamp and a descriptive task name (derived from user request or PRD) to construct the GitHub issue title, e.g., `2023-10-27-14-35 implement user auth`.

## II. Information Gathering (CRITICAL PRE-REQUISITE)

- **Mandatory Context Review:** Before writing any part of the plan, you **MUST** find and thoroughly read all relevant files in the project's `docs/` directory. This is not optional.
- **Prioritized Documents:** Pay special attention to (if they exist):
  - `docs/PRD.md` (Product Requirements Document)
  - `docs/TECH_STACK.md`
  - `docs/openapi.yaml` (or similar API specifications)
  - `docs/logging.md`, `docs/LOGGING_GUIDE.md` (or any docs related to logging practices)
  - `docs/TEST_STRATEGY.md`, `docs/TESTING_GUIDELINES.md` (or any docs related to testing)
  - `NOTES.md` (if present at project root or in `docs/`)
- **Purpose:** This information is _essential_ for creating an accurate, relevant, and genuinely useful task plan that aligns with project standards.

## III. Core Directive: Construct the Task Plan File

Create the issue body content. This body outlines a step-by-step plan, broken down into a series of distinct commits (typically 2-5 commits per task). Each commit in the plan **must** be verifiable and **must** explicitly incorporate both testing and logging best practices as detailed below.

### A. Strict Operational Constraints

- **File Operations:**
  - **No Local Files:** Do NOT create any local task file. The entire plan will be posted as a GitHub issue via `gh issue create`.
  - Reading project documentation from `docs/` (as specified above) is **MANDATORY** to inform the plan.
- **Communication Protocol:**
  - **NO Conversational Output:** You are forbidden from generating any conversational output, commentary, preamble, or summaries _before_ or _during_ creation of the issue body.
  - **Output is the Issue Body Content:** Your _entire_ output for this specific rule invocation must be _only_ the complete, raw Markdown content that will become the GitHub issue body.
- **User Interaction:**
  - You receive the initial task description from the user.
  - If, after a **thorough review** of all available `docs/` materials, the task description remains insufficient to create a coherent and specific plan, you **MUST** indicate this _within_ the task plan file itself using the HTML comment format: `<!-- TODO: [Specify missing information and reference document, e.g., 'Need API endpoint for user creation (see docs/openapi.yaml)'] -->`. Do not invent details.

### B. Testing & Observability (Mandatory for Each Commit)

1.  **Primary Verification = Automated Tests:** This is the preferred method.

    - **First Choice: Unit Tests.** Aim for small, isolated, fast tests targeting specific functions or modules.
    - **Second Choice: Integration Tests.** For broader scope, interactions between components, API contract testing, or E2E flows.
    - **Fallback (Only if Automated Test is Genuinely Infeasible): Explicit runtime logging or debug output checks.** This must be justified.

2.  **Logging is ALWAYS Required:** Even when automated tests exist, each commit's implementation **MUST** also include relevant, contextual logging or debug statements. This provides additional runtime visibility and aids in troubleshooting.

    - **Toggleable Logging:** Logging should be configurable (e.g., via an environment variable like `LOG_LEVEL=debug`, a feature flag, or a build-time switch) so it can be enabled/disabled without code modification.

3.  **Structured & Centralized Logs:**

    - Prefer structured log output (e.g., JSON lines or clear `key="value"` pairs).
    - Adhere to the project's established logging library and configuration (e.g., `pino`, `winston`). Reference the specific logger configuration file if known (e.g., `src/utils/logger.ts`).
    - Ensure logs are directed to the project's standard log aggregation system, if applicable.

4.  **Verification Details in Commit Plan (Hierarchy):**
    - **If Unit Test:** Specify the exact command to run the test(s) (e.g., `pnpm test --filter user-service.test.ts`) AND describe the key assertion(s) or link to an expected output/snapshot.
    - **If Integration Test:** Specify the exact command or script (e.g., `pnpm test:e2e --spec ./tests/e2e/auth.spec.ts`) AND describe the expected outcome or key behavior being verified.
    - **If Log Inspection (Fallback):** Detail the precise steps to inspect logs (e.g., `kubectl logs -l app=api-service -c main-container --tail=100 | jq 'select(.msg == "PaymentProcessed")'`) and what specific log message/pattern/value to look for.

### Issue Body Structure

The issue body **MUST** be structured as a sequence of planned commits. The primary source for content is the user's task description, **validated, augmented, and detailed** with specific information (file paths, function names, API endpoints, configuration details) extracted from the relevant `docs/` files. **Neglecting to consult and incorporate details from project documentation is a critical failure.**

Each commit title **MUST** follow semantic commit style (e.g., `feat: ...`, `fix: ...`, `test: ...`, `docs: ...`, `chore: ...`) **and**
include the GitHub issue number in parentheses for traceability. Example:
`feat: add login API (#42)`.

```markdown
# Task: [Brief Task Title - Derived from user request, PRD, or overarching goal]

## Commit 1: [type: Clear, Descriptive Title for this specific commit]

**Description:**
[Explain the precise goal of *this commit*. Include specific file paths (e.g., `src/modules/auth/auth.controller.ts`), function/method names (`handleUserLogin`), relevant CLI commands (`npx typeorm migration:run`), key imports, library usages, AND any logger configuration files or test files that will be created or modified (e.g., `tests/unit/auth.controller.test.ts`, `src/config/logger.config.ts`). Be explicit and detailed.]

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `[Exact command to run the test, e.g., pnpm vitest run src/modules/auth/auth.controller.test.ts]`
    - **Expected Outcome:** `[Describe key assertion, e.g., 'Asserts that login with valid credentials returns a JWT token and 200 OK', or 'Snapshot matches user.snapshot']`
2.  **Logging Check:**
    - **Action:** `[How to trigger/observe logs, e.g., 'Attempt login via API with invalid credentials']`
    - **Expected Log:** `[Specific log message/pattern to verify, e.g., 'INFO: Login attempt failed for user: test@example.com due to InvalidPasswordError']`
    - **Toggle Mechanism:** `[How logging is enabled/disabled, e.g., 'LOG_LEVEL=info']`

---

## Commit 2: [type: Clear, Descriptive Title for this specific commit]

**Description:**
[Details for commit 2...]

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `[...]`
    - **Expected Outcome:** `[...]`
2.  **Logging Check:**
    - **Action:** `[...]`
    - **Expected Log:** `[...]`
    - **Toggle Mechanism:** `[...]`

---

(Repeat structure for up to 5 commits as needed for the task. For simple tasks, you may only need 1-2 commits.)
```

## IV. Post Task Plan Creation: Stop and Notify

After posting the issue with the complete body via `gh issue create`, **STOP**. Notify the user of the newly created issue number or URL.

**Immediately after** posting, provide a short executive summary of the planned commits so the user can quickly review the steps. This summary must not be part of the issue body itself.

After delivering the summary, await the user's next instructions.

**REMEMBER: Your output is SOLELY the Markdown content of the issue body. This plan MUST be informed by `docs/` research, detail 2-5 verifiable commits, and rigorously include both automated tests and toggleable logging for each commit. Adhere strictly to the output format and communication constraints.**

Once the task plan is complete, wait for the user to provide feedback.
