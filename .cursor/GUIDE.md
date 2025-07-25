# Rules and Workflows

## Introduction

This document serves as a guide for understanding and utilizing the custom AI workflow rules defined in the `.cursor/rules/` directory. These rules are not just individual commands; they form a cohesive system for planning, executing, and documenting software development tasks.

The core philosophy of this system is:

1.  **Plan First:** Decompose complex tasks into small, verifiable commits.
2.  **Document as You Go:** Generate and synchronize high-quality documentation as a part of the development process, not an afterthought.
3.  **Automate & Standardize:** Use CLI tools and predefined workflows to ensure consistency and efficiency.
4.  **Observe Everything:** Build in logging and testing from the very first step.

This guide will walk you through the primary scenarios ("Playbooks") and utility workflows you'll encounter.

---

## 1. Core Operating Principles (The Foundation)

These rules are always active and define the AI's fundamental behavior. You don't invoke them directly; they influence every interaction.

| Rule File(s)              | Problem Solved                                                                   | User Story                                                                                                                                                                       |
| :------------------------ | :------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_core/persona.mdc`       | The AI is too passive or waits for constant confirmation.                        | "As a developer, I want the AI to be an autonomous partner who can take initiative and complete tasks without my constant supervision, so I can focus on higher-level problems." |
| `_core/communication.mdc` | The AI's responses are too verbose and conversational.                           | "As a developer, I need concise, direct updates about what the AI is doing, why it succeeded or failed, and what's next, so I can quickly assess progress."                      |
| `_core/principles.mdc`    | Code becomes monolithic, hard to debug, and difficult to revert.                 | "As a developer, I want my codebase to be built with observability, modularity (small files), and easy-to-revert commits, so it remains maintainable."                           |
| `_core/standards.mdc`     | Inconsistent practices for Git, testing, and package management across the team. | "As a developer, I need our team to follow consistent standards for commit messages, testing protocols, and package management, so our repository stays clean and predictable."  |
| `_core/prefer-clis.mdc`   | Manually creating config files is error-prone and slow.                          | "As a developer, when I need to initialize a new tool or project, I want to use its official CLI to ensure the setup is correct and follows best practices."                     |

---

## 2. The Main Development Playbooks

These are the primary end-to-end workflows for building features or fixing bugs.

### Playbook A: The GitHub-Driven Workflow

This is the recommended workflow for tasks that are tracked as GitHub Issues. It uses the issue as the single source of truth for the plan.

- **Problem Solved:** Keeps development work tightly synchronized with project management in GitHub. Provides clear traceability from issue to commits to PR.
- **User Story:** "As a developer, I've been assigned GitHub issue #123. I want the AI to read the issue, create a step-by-step implementation plan, execute it, and create a Pull Request, so I can efficiently complete my assigned task."

#### Typical Sequence:

1.  **Plan the Task (`workflows/github/plan-github.md`)**

    - **When:** You have a GitHub issue number and need a detailed implementation plan.
    - **Action:** You tell the AI, "Plan the work for issue #123."
    - **Result:** The AI reads project docs (`docs/PRD.md`, `TECH_STACK.md`, etc.) and the user's request, then creates a new GitHub issue with a title like `2023-10-27-14-35-implement-user-auth`. The body of this new issue contains a detailed, multi-commit plan with verification steps.

2.  **Execute the Plan (`workflows/github/execute-github.md`)**

    - **When:** The plan in the GitHub issue is approved and ready for implementation.
    - **Action:** You say, "Execute the plan in issue #125."
    - **Result:** The AI systematically works through each commit in the issue body. After each successful commit, it comments on the issue with `✅ <sha> <commit-message>`, creating a live progress log.

3.  **Create the Pull Request (`workflows/github/pr-create-github.md`)**
    - **When:** All commits from the plan have been executed and verified.
    - **Action:** This can be triggered automatically after `execute-github` or manually by saying, "Create a PR for the current branch."
    - **Result:** The AI drafts a detailed PR body in `docs/pr/pr-body-file-<branch-name>.md`, pushes the branch, and uses the `gh` CLI to open a pull request, linking it to the original issue.

#### Branching Paths & Alternatives:

- **Continuing an Interrupted Task:** If the execution was stopped, use `workflows/github/continue-github.md`. The AI will check local commits against the `✅` comments in the issue and resume from where it left off.
- **Reviewing Changes:** Before creating the PR, you can run `workflows/github/review-github.md` to get an AI-driven code review of all staged and unstaged changes.

### Playbook B: The Local Task-File Workflow

This workflow is ideal for exploratory work, rapid prototyping, or when you don't want to create a GitHub issue upfront. It uses a local markdown file in `docs/tasks/` as the source of truth.

- **Problem Solved:** Allows for structured, planned development without the overhead of creating a formal GitHub issue. Keeps planning artifacts version-controlled with the code.
- **User Story:** "As a developer, I have an idea for a refactor that isn't a formal task yet. I want to create a local plan, execute it, and then decide if it's worth creating a PR for."

#### Typical Sequence:

1.  **Plan the Task (`workflows/task/plan.md`)**

    - **When:** You have a task in mind but no GitHub issue.
    - **Action:** You tell the AI, "Create a plan to implement a new caching layer."
    - **Result:** The AI creates a new file: `docs/tasks/<timestamp>-caching-layer.md`. This file contains the detailed, multi-commit plan.

2.  **Execute the Plan (`workflows/task/execute.md`)**

    - **When:** The local task plan is ready.
    - **Action:** You say, "Execute the plan in `docs/tasks/<timestamp>-caching-layer.md`."
    - **Result:** The AI works through the commits defined in the local markdown file.

3.  **Create the Pull Request (`workflows/github/pr-create-github.md`)**
    - **When:** The task is complete.
    - **Action:** "Create a PR for this work."
    - **Result:** Same as in Playbook A.

---

## 3. Project Initialization & Documentation Workflows

This set of rules is designed to create foundational project documents from a simple set of notes or ideas.

- **Problem Solved:** Translates high-level ideas into structured, standardized project documentation, ensuring alignment and clarity from the start.
- **User Story:** "As a product manager or lead developer, I have a brain dump of ideas in a `NOTES.md` file. I want the AI to convert this into a formal Product Requirements Document, Tech Stack definition, and API specification."

#### Typical Sequence:

1.  **Create Product Requirements (`documentation/prd.mdc`)**

    - **When:** You have a `NOTES.md` or a similar idea document and need a formal PRD.
    - **Result:** The AI reads the source and generates a structured `docs/PRD.md` with 8 predefined sections.

2.  **Define the Tech Stack (`documentation/tech-stack.mdc`)**

    - **When:** The PRD is created, and you need to define the technology to build it.
    - **Result:** The AI reads `docs/PRD.md` and `NOTES.md` to generate `docs/TECH_STACK.md`, outlining the entire technology stack.

3.  **Specify the API (`documentation/openapi-spec.mdc`)**

    - **When:** The PRD and Tech Stack are defined, and the project involves an API.
    - **Result:** The AI reads the PRD and Tech Stack to generate a `docs/openapi.yaml` file, defining the API contract.

4.  **Visualize the Architecture (`documentation/diagram.mdc`)**

    - **When:** You have core documents (PRD, Tech Stack) and need a visual representation.
    - **Result:** The AI generates a GitHub-compatible Mermaid diagram in `docs/diagrams/`.

5.  **Synchronize All Docs (`documentation/sync.mdc`)**
    - **When:** After significant code changes, you need to ensure all documentation is still accurate.
    - **Result:** The AI reviews recent changes and updates all files in the `docs/` directory to reflect the current state of the project.

---

## 4. Standalone & Utility Workflows

These are specific, one-off rules to solve common development problems.

| Rule File(s)                                         | Problem Solved                                                                                            | When to Use                                                                                                       |
| :--------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| **Task Ideation**                                    |
| `workflows/task/outline.md`                          | I'm not sure about the best way to approach a task.                                                       | Before creating a full plan, to get 3-5 high-level options to choose from.                                        |
| `workflows/task/next.md`                             | I've finished a task and don't know what to do next.                                                      | To get a recommendation for the most logical next task based on project goals and documentation.                  |
| `workflows/task/todos-next.md`                       | Important `TODO` comments get lost in the codebase.                                                       | To scan all documentation for pending `TODO` items and get a prioritized list.                                    |
| **Dependency & Scripting**                           |
| `workflows/dependencies/audit.mdc`                   | Dependencies become outdated or have security vulnerabilities.                                            | To perform a comprehensive audit of all project dependencies and generate a plan for updates.                     |
| `development/scripts.mdc`                            | I need to create a new, executable script for a one-off task.                                             | To quickly scaffold a new TypeScript script in the `scripts/` directory, runnable with Bun.                       |
| `tools/package-managers/pnpm/build-script-fixes.mdc` | `pnpm` blocks a build script from a trusted dependency.                                                   | When an installation fails due to pnpm's security model, to allow a specific dependency to run its build scripts. |
| **Parallel Development**                             |
| `task/parallel.md`                                   | A large task needs to be broken down for multiple developers to work on simultaneously without conflicts. | To generate multiple, independent task plans that operate on entirely different sets of files.                    |

---

## 5. Meta Workflows (Managing the Rules)

These rules help you manage and personalize the AI workflow system itself.

| Rule File(s)                                 | Problem Solved                                                                                  | When to Use                                                                                                                 |
| :------------------------------------------- | :---------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `workflows/config/personalize-rule.mdc`      | A team-wide rule doesn't fit my personal preference (e.g., I want the AI to be more talkative). | To locally modify a rule and use `git update-index --assume-unchanged` to prevent the change from being committed.          |
| `workflows/config/update-personal-rules.mdc` | The AI doesn't know what tools are installed on my machine.                                     | To scan your system and create a `.cursor/rules/_/<username>.mdc` file that informs the AI about your specific environment. |
| `workflows/meta/create-workflow.mdc`         | I just completed a novel process with the AI and want to save it as a reusable workflow.        | After a successful but complex interaction, to have the AI analyze the conversation and generate a new `.mdc` rule file.    |
| `workflows/analysis/document-failures.mdc`   | A workflow failed, and I want to prevent the same mistake from happening again.                 | After a failed workflow, to analyze the root cause and generate a new rule that documents the failure and how to avoid it.  |

---

## 6. Tool-Specific Guides

These rules are not workflows but act as reference manuals for using specific command-line tools. The AI will consult these when you ask it to perform a task involving one of these tools.

- `tools/cli/ghx.md`: For searching code on GitHub.
- `tools/cli/repomix.md`: For packing repository files into a single context for AI analysis.
- `tools/cli/worktree.md`: For managing Git worktrees.
- `tools/cli/wrangler.md`: For interacting with the Cloudflare developer platform.
