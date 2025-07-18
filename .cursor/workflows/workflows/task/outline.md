# Generate Task Outline Options

**Goal:** Before committing to a single task plan, provide the user with several concise task options to choose from. Each option is a short sequence of commit summaries showing how the task would proceed and when it would end.

## File Existence Check

Determine which documentation sources are available:

```bash
ls . docs
```

Use this to guide your context review.

## When to Use

Use this rule when the user requests help planning work but has not yet selected a specific task. The output is a set of alternative task outlines, not a full task file.

## Steps

1. **Review Context**
   - Scan existing documentation in `docs/` for project goals and recent work.
   - Consider any open TODOs or next steps in the repo.
2. **Draft 3-5 Task Options**
   - For each option, write a brief one-sentence summary of the overall objective.
   - Under each option, list 2-5 bullet points representing the commits that would be made to complete the task. Keep commit summaries short (one line each).
3. **Present Results**
   - Output a numbered list of the task options with their commit bullets.
   - Conclude with a short prompt asking the user to pick one option for further planning.
   - After listing the options, provide a brief executive summary highlighting the main differences between the options. This summary should come after the list and not be included within any generated files.

**REMEMBER: This rule only proposes outlines. Do not create any files or commit anything. Wait for the user to choose an option before generating a full task plan.**
