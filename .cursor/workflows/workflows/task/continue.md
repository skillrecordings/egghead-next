# Continue Task from Plan File

**Your Primary Goal: Check commits since the last push, reconcile them with a specified task file, and resume executing the remaining commits starting from the last verified commit.**

## File Existence Check

Confirm the task file is present and fetch the latest remote updates:

```bash
ls . docs
```

If the task file is missing, stop and notify the user.

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

4. Review the commit history for messages containing the task filename to locate the last executed commit.
5. Compare the remaining commit titles in the task file with this history to determine which commits still need to be created.

## Resume Remaining Commits

For each remaining commit in the task file, follow the workflow defined in `task-execute.mdc`:

1. Implement the changes for the next unverified commit.
2. Perform all specified verification steps before committing.
3. Create the commit using the exact message from the task file.
4. Continue sequentially until all commits in the plan are processed.

## Completion Criteria

The task is **Complete** when every commit in the task file has been created and all verifications pass. After completing the final commit, run the `.cursor/rules/automation/update-project.mdc` instructions.

**REMEMBER:** Avoid conversational output between commits. Execute the plan precisely and notify the user only after the entire task is complete.
