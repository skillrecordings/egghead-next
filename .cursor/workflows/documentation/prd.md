# Generate and Maintain `docs/PRD.md` (Product Requirements Document)

**Your Core Task: Create or update the `docs/PRD.md` file. This document MUST strictly adhere to the 8-section structure defined below. Populate its content SOLELY by extracting and synthesizing information from `NOTES.md` (or a user-provided equivalent source). If critical information for a section is genuinely absent from this source, and only then, insert a specific `<!-- TODO: ... -->` comment.**

## File Existence Check

Confirm available source files first:

```bash
ls . docs
```

Use these results before proceeding.

Your entire output for this rule invocation **MUST BE ONLY** the complete, raw Markdown content of the `docs/PRD.md` file.

## I. Strict Operational Constraints (MANDATORY)

- **Permitted File Operations:**
  - **Read-Only:** `NOTES.md` (or the specified primary input document if different).
  - **Read/Write:** `docs/PRD.md` (this is the only file you will modify or create).
  - **No Other Files:** Do not access, read, or write any other files in the project.
- **Communication Protocol (ABSOLUTE):**
  - **NO Conversational Output:** You are strictly forbidden from generating ANY conversational output, commentary, preamble, introductions, or summaries before, during, or after generating the `docs/PRD.md` content.
  - **Sole Output = File Content:** Your _only_ output is the complete Markdown content intended for `docs/PRD.md`.
- **User Interaction (Handled via TODOs in `docs/PRD.md`):**
  - You operate based on an implicit or explicit request to manage `docs/PRD.md`.
  - You do not converse directly with the user during this process.
  - Deficiencies in information (requiring a TODO) are handled _within_ the `docs/PRD.md` file itself, as per the TODO logic below.

## II. The Blueprint: `docs/PRD.md` Structure & Content Source

The `docs/PRD.md` file **MUST** be organized into the following eight sections. The questions/points within each item of the "PRD Section Outline" (below) define the required content and also serve as the basis for any necessary `<!-- TODO: ... -->` comments if information is missing from the `NOTES.md` (or equivalent designated source document).

### PRD Section Outline (Mandatory Structure for `docs/PRD.md`)

1.  **`## 1. Core Functionality & Purpose`**

    - What is the primary problem this product/feature solves for the end-user?
    - What is the core functionality required to address this problem?

2.  **`## 2. Key Goals & Scope`**

    - What are the critical objectives for this product/feature (e.g., target user impact, business goals, technical achievements like performance benchmarks or specific integrations)?
    - What items are explicitly out-of-scope for the current development cycle or version?

3.  **`## 3. User Interaction & Design Insights`**

    - Who is the primary user type (e.g., API consumer, web application user, internal admin)?
    - Describe the primary ways users will interact with the core features (reference UI mockups, API contracts, user flow diagrams if available in `NOTES.md` or linked external resources).

4.  **`## 4. Essential Features & Implementation Highlights`**

    - List the absolute must-have functionalities for the initial version/MVP.
    - Provide high-level implementation considerations or key components for each essential feature.

5.  **`## 5. Acceptance Criteria & Definition of "Done"`**

    - For each key feature or user story, what are the specific, measurable, achievable, relevant, and time-bound (SMART) conditions that must be met for it to be considered "done"?
    - How will successful completion be verified (e.g., specific tests, user validation scenarios)?

6.  **`## 6. Key Requirements & Constraints`**

    - List any non-negotiable technical requirements (e.g., target platform, specific languages/frameworks if mandated, required third-party integrations).
    - List key non-functional requirements (NFRs) such as performance targets (latency, throughput), scalability needs, security standards (compliance, data privacy), reliability goals (uptime), and any known constraints (e.g., infrastructure limitations, budget, timelines).

7.  **`## 7. Success Metrics`**

    - How will the success of this product/feature be measured post-deployment from a user and business perspective (e.g., user adoption rate, task completion time, error rates, conversion rates, revenue impact)?
    - (Optional, if distinct from above) How will the development team measure technical success (e.g., system stability, maintainability, code quality metrics)?

8.  **`## 8. Development Logistics & Lookahead`**
    - Identify significant technical risks, challenges, or dependencies. Include initial thoughts on mitigation strategies.
    - List major assumptions being made that, if incorrect, could impact development.
    - Briefly consider future development aspects or extensibility points that current design choices should accommodate.

## III. Workflow for Generating/Updating `docs/PRD.md`

1.  **Access Source Document (`NOTES.md` or equivalent):**

    - Read the content of `NOTES.md` (or the user-specified primary input document).
    - _This is your ONLY source of information for populating `docs/PRD.md`._ If this document is missing or sparse, the `PRD.md` will reflect that (potentially with many TODOs).
    - Read the current content of `docs/PRD.md` if it already exists (for context during updates).

2.  **Manage `docs/PRD.md` Content:**

    - **Initialization:** If `docs/PRD.md` does not exist, create it. Your output will be the initial version containing all eight section headers (as listed in the "PRD Section Outline") followed by content or TODOs as per the logic below.
    - **Content Integration (Section by Section):** For each of the eight mandatory sections:
      - Review `NOTES.md` (and `docs/PRD.md` itself if updating) for information relevant to _that specific section_.
      - Synthesize and write the information into the corresponding section of your `docs/PRD.md` output. If updating existing content, intelligently merge or replace based on the latest available information from `NOTES.md`. Aim for comprehensive but concise statements directly addressing the points in the outline.

3.  **Identify Gaps & Insert TODOs (Strict Logic):**

    - After attempting to populate a section using **only `NOTES.md` (or the specified equivalent source)**:
      - A `<!-- TODO: ... -->` comment **MUST ONLY** be inserted if the section in your generated `docs/PRD.md` remains **genuinely empty** OR contains only placeholder text (e.g., a simple rephrasing of the section title without any substantive information from `NOTES.md`) OR if critical information explicitly requested by that section's definition (as per the "PRD Section Outline") is **clearly missing** and **cannot be found in `NOTES.md`**.
      - **DO NOT** insert a TODO if the section has been populated with _any_ relevant information from `NOTES.md`, even if that information could theoretically be more detailed. The purpose of the TODO is to flag _critically missing information that was not found in the designated `NOTES.md` source_, not to solicit further details on already present information.
      - **TODO Comment Format:** `<!-- TODO: [Question from the "PRD Section Outline" for the missing piece of information. Be specific to the context if possible.] -->`
        - Example for section 1 if core problem isn't in `NOTES.md`: `<!-- TODO: What is the primary problem this product/feature solves for the end-user? (Expected in NOTES.md) -->`
        - Example for section 5 if acceptance criteria are absent: `<!-- TODO: What are the specific, testable acceptance criteria for key feature X? (Expected in NOTES.md) -->`

4.  **Final Output:** Your _sole output_ is the complete, updated content of `docs/PRD.md`.

Immediately after providing this file content, output a short executive summary of the key sections you filled in or noted as TODOs. Keep this summary separate from the file content.

**REMEMBER: Your output MUST ONLY be the full Markdown content for `docs/PRD.md`. Populate it strictly from `NOTES.md` (or specified primary source). Follow the 8-section structure. Insert `<!-- TODO: ... -->` comments (containing the relevant guiding question from the outline) ONLY for sections where critical information is verifiably absent from the specified source document.**
