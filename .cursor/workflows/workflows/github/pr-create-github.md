# Create a High-Quality Pull Request

**Your Task: Follow this comprehensive checklist to prepare and create a well-documented, clean, and accurate Pull Request (PR) using the `gh` CLI.**

## File Existence Check

Confirm the presence of `.gitignore` and the PR body file location:

```bash
ls . docs
```

Use this information before running the remaining steps.

0.  **Pre-check: Unstaged Changes**

    - **Action:** Execute `git status`.
    - **Review:** Identify any modified or new files relevant to this PR that are not yet staged.
    - **Stage if Necessary:** If relevant changes are unstaged, use `git add <file>...` or `git add .`.
    - **Confirm:** Re-run `git status` to ensure all intended changes for this PR are now staged.

1.  **Audit Staged Files (Critical Check)**

    - **Verify `.gitignore**:\*\* Ensure your project's `.gitignore` file is up-to-date and correctly excludes all unwanted files (e.g., local environment files, build artifacts, logs, secrets).
    - **Review Staged List:** Execute `git status` again. Meticulously review the final list of files staged for commit.
    - **Identify Unwanted Files:** Look for any files that should _not_ be part of the repository or this specific PR (e.g., secrets, large binaries, temporary files). Standard configuration files like `.vscode/`, `.cursor/`, `.editorconfig` are generally acceptable if intended for the project.
    - **Remediate if Unwanted Files Found:**
      - Add/update patterns in `.gitignore` for these files.
      - Unstage them: `git reset HEAD <file>...`.
      - If already tracked, remove from Git history: `git rm --cached <file>...`.
      - For untracked files, ensure they are now ignored or delete them if they are genuinely extraneous.
    - **Final Confirmation:** Run `git status` one last time. Verify that _only_ the intended and appropriate files remain staged.

2.  **Draft Pull Request Body**

    - **Create/Update PR Body File:** Prepare the PR description in a file named `docs/pr/pr-body-file-<branch-name>.md` (replace `<branch-name>` with your current Git branch name).
    - **Structure for Clarity:** Use Markdown with clear headings:
      - `## Summary`
      - `## Key Changes`
      - `## Testing Done` (or `## How to Verify`)
      - `## Related Issues` (e.g., `Fixes #123`, `Closes #456`, `Addresses #789`)
    - **Lead with the Goal:** The `Summary` should start with a concise statement of the PR's primary purpose and impact.
    - **Detail Key Changes:** Under `Key Changes`, use bullet points (`- `) to list significant additions, fixes, or features. Be specific about files or modules affected if it aids understanding.
    - **Provide Context & Rationale:** Briefly explain the 'why' behind the changes. Link to issue trackers or design documents if applicable.
    - **Describe Verification:** Under `Testing Done`, detail the testing performed (unit, integration, manual steps). If manual verification is needed by reviewers, provide clear, actionable steps.
    - **Save:** Ensure the PR body file is saved.

3.  **Execute Project Update Rules (If Applicable)**

    - **Consult Rules:** Locate and carefully read the `./cursor/rules/automation/update-project.mdc` file.
    - **Follow Instructions:** Execute all instructions specified within that file precisely, if they are relevant before a PR creation.

4.  **Create Pull Request with `gh` CLI**
    - **Push Branch (if not already done):** Ensure your local branch is pushed to the remote: `git push -u origin <branch-name>`.
    - **Construct `gh pr create` Command:**
      - Use a clear, concise title: `--title "type: Short description of main change"` (e.g., `feat: Implement user authentication flow`). Follow conventional commit message standards if the project uses them.
      - Specify the drafted body file: `--body-file docs/pr/pr-body-file-<branch-name>.md`.
      - Consider `--fill` to use commit messages for PR title and body if appropriate for simple PRs and your workflow allows.
    - **Execute:** Run `gh pr create ...` with your prepared options.
    - **Review `gh` Output:** Carefully check the preview of the title and body provided by `gh pr create` before final submission. Ensure it is accurate, clear, and complete.

**Example `gh pr create` command:**

```bash
# Ensure branch is pushed first: git push -u origin fix-label-sanitization
gh pr create --title "fix: Enforce normalized, dash-separated, lowercase labels" --body-file docs/pr/pr-body-file-fix-label-sanitization.md
```

After creating the pull request, give a concise executive summary of the key changes and tests so reviewers know what to expect. Keep this summary separate from the PR body file.

**REMEMBER: The objective is to create a meticulously prepared Pull Request. This includes clean commits, a descriptive title, a comprehensive body, and adherence to any project-specific pre-PR checks. A high-quality PR facilitates easier review and smoother integration.**
