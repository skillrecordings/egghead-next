# Using `wt` CLI for Git Worktree Management

**Your Task: When managing Git worktrees, especially for integration with the Cursor editor, use the `wt` command-line tool. This document provides its usage instructions, examples, and important operational guidelines.**

**Initial Setup Note:** If `wt` commands fail, the tool might need to be installed globally. Refer to `https://www.npmjs.com/package/@johnlindquist/worktree` for installation instructions (e.g., `pnpm add -g @johnlindquist/worktree`).

## Operational Guidelines for AI:

- **Default Action:** When the user expresses intent related to a new worktree (e.g., "create a worktree for branch X", "start work on Y"), assume they want to create a _new_ worktree using `wt new [branchName]` unless they explicitly specify another `wt` command (like `list`, `remove`, etc.).
- **Post-Creation Pause:** After successfully creating a new worktree using `wt new`, pause and await the user's next instruction. Do not automatically proceed with other actions unless explicitly part of a larger, pre-defined plan.
- **Dependency Installation (CRITICAL DEFAULT):** When executing `wt new`, **ALWAYS append `-i pnpm`** to the command to ensure dependencies are installed using `pnpm` by default. For example: `wt new feature/login -i pnpm`.

## `wt` Command Reference

Usage: `wt [options] [command]`

description:

### Options:

`-V, --version` Output the version number
`-h, --help` Display help for command

### Commands:

`new [options] [branchName]`
Create a new worktree for the specified branch.
Installs dependencies if specified (see `-i` option under command-specific options, and AI default above).
Opens in editor.

`list | ls`
List all existing worktrees for this repository.

`remove | rm [options] [pathOrBranch]`
Remove a specified worktree. Cleans up `.git/worktrees` references.

`merge [options] <branchName>`
Commit changes in the target branch and merge them into the current branch, then remove the branch/worktree.

`purge`
Safely remove all worktrees except for the main branch, with confirmation.

`pr [options] <prNumber>`
Fetch the branch for a given GitHub PR number and create a worktree.

`config`
Manage CLI configuration settings.

`help [command]`
Display help for a specific command.

### Examples for `wt new`:

- `wt new feature/login -i pnpm` (AI Default: creates worktree, installs with pnpm)
- `wt new feature/chat --checkout -i pnpm` (AI Default: creates, checks out, installs with pnpm)
- `wt new feature/auth -p ./auth-worktree -i pnpm` (AI Default: creates at path, installs with pnpm)
- `wt new feature/vscode -e code -i pnpm` (AI Default: creates, opens in VSCode, installs with pnpm)

_(Note: The examples above have been updated to include the AI's default `-i pnpm` behavior.)_

**REMEMBER: Use `wt` for Git worktree operations. Always assume `wt new` is the primary intent for new worktree requests and ALWAYS include `-i pnpm` with `wt new` for dependency installation.**
