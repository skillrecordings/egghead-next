# Continue Task from GitHub Issue

**Your Primary Goal: Review commits since the last push, compare them against progress recorded in a specified GitHub issue, and resume executing the remaining commits from the last verified commit.**

## File Existence Check

Ensure the issue exists and fetch the latest remote updates:

```bash
ls . docs
```

If the issue is missing or inaccessible, stop and notify the user.

## Determine Current Progress

1. Identify the current branch and its upstream:

```bash
git branch --show-current
git rev-parse --abbrev-ref --symbolic-full-name @{u}
```

2. Check for any unstaged or staged changes:

```bash
git status --short
```

If there are local modifications, decide whether to commit them, stash them, or discard them before continuing.

3. List commits not yet pushed:

```bash
git log --oneline @{u}..HEAD
```

4. Retrieve the issue comments to locate lines like `✅ <sha> <commit-message>`.
5. Compare these recorded commits with the local history to determine which commits in the plan have already been completed.

## Resume Remaining Commits

For each remaining commit described in the issue body, follow the same workflow as `task-execute.mdc`:

1. Implement the changes for the next unverified commit.
2. Perform all specified verification steps before committing.
3. Create the commit using the exact message from the issue.
4. Comment `✅ <commit-sha> <commit-message>` on the issue to mark the commit complete.
5. Continue sequentially until all commits in the issue are processed.

## Completion Criteria

The task is **Complete** when every commit listed in the issue has a corresponding `✅` comment with its SHA and commit message and all verifications pass. After completing the final commit, run the `.cursor/rules/automation/update-project.mdc` instructions.

**REMEMBER:** Avoid conversational output between commits. Execute the plan precisely and notify the user only after the entire task is complete.
