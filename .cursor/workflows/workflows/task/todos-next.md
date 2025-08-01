# Identify and Report TODO Items from Documentation (`docs/`)

**Your task: Scan all files within the `docs/` directory to find comments or notes marked as "TODO", and then list the most pressing or contextually relevant ones.**

## File Existence Check

List the documentation directory to confirm presence:

```bash
ls . docs
```

Then continue with the scanning steps.

Follow this process:

1.  **Scan Documentation for TODOs:**

    - Systematically search the content of every file located within the `docs/` directory (and its subdirectories).
    - Look for lines or comments explicitly containing the keyword "TODO" (case-insensitive, if appropriate for the tool being used for searching).

2.  **Extract and Contextualize TODOs:**

    - For each identified TODO, extract the full text of the TODO comment.
    - Note the file path and line number where the TODO was found.

3.  **Filter and Report Relevant TODOs:**
    - From the list of all found TODOs, select those that appear most pressing, actionable, or relevant to the current project goals or ongoing tasks.
    - Consider factors like urgency implied by the TODO text, relation to known issues, or impact on project progress.
    - Present the selected TODOs in a clear, itemized list.

**Output Format:**

Provide a list of the identified TODOs, formatted as follows for each:

- **TODO:** [Full text of the TODO comment]
  - **Location:** `docs/path/to/file.md:line_number`
  - **(Optional) Priority/Relevance:** [Brief note on why it's considered pressing, if applicable]

**REMEMBER: Your goal is to surface actionable TODO items embedded within project documentation that require attention, helping to ensure that planned work or notes for improvement are not overlooked.**
