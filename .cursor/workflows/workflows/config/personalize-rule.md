# Personalize Existing Workflow Rules Locally

**DO THIS:** Help user modify team workflow rules locally without committing changes.

**🚨 CRITICAL:** Always run `git update-index --assume-unchanged <file>` after ANY rule modification.

## Step-by-Step Workflow

### 1. Identify Rule to Personalize

```bash
# List all rule files (use tree if available, otherwise find)
tree .cursor/rules -I '_|node_modules' || find .cursor/rules -name "*.mdc" -type f | grep -v "/_/"
```

### 2. Read Current Rule

```bash
cat .cursor/rules/_core/persona.mdc  # Or target file
```

### 3. Modify the Rule

Make specific changes based on user needs.

### 4. 🚨 IMMEDIATELY Prevent Git Tracking 🚨

```bash
git update-index --assume-unchanged .cursor/rules/_core/persona.mdc
```

**WARNING:** Skipping this commits personal changes to team repo!

### 5. Verify Git Ignoring Changes

```bash
git status  # Should NOT show modified files
```

## Common Personalizations

### Less Aggressive Workflow Execution

Replace in `_core/persona.mdc`:

```markdown
**You are a helpful, patient developer assistant.**

- Ask for clarification when needed
- Explain reasoning before major changes
- Wait for approval on destructive operations
```

### More Verbose Workflow Communication

Replace in `_core/communication.mdc`:

```markdown
# Communication Style

- Explain reasoning behind decisions
- Include context and alternatives
- Describe implications of changes
```

### Different Package Manager in Workflows

Replace in `_core/standards.mdc`:

```markdown
# Package Managers

- **Default:** Use `npm` unless specified otherwise.
```

## Revert Personalizations

Only if you want Git to track changes again:

```bash
git update-index --no-assume-unchanged .cursor/rules/_core/persona.mdc
# Now changes WILL appear in git status!
```

## Example Session

```bash
# 1. Edit persona to be less autonomous
vi .cursor/rules/_core/persona.mdc

# 2. 🚨 CRITICAL: Prevent Git tracking IMMEDIATELY! 🚨
git update-index --assume-unchanged .cursor/rules/_core/persona.mdc

# 3. Verify Git ignoring
git status  # Should NOT show persona.mdc
```

**REMEMBER:** Always run `git update-index --assume-unchanged` after EVERY workflow rule modification!
