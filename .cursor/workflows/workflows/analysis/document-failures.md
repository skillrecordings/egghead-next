# Document Workflow Failures and Create Prevention Rule

**DO THIS:** Analyze the conversation for failures, errors, and unsuccessful approaches, then create a rule to prevent these issues in future workflows.

## Failure Analysis Process

### 1. Identify Failure Patterns

Look for:

- Commands that returned errors
- Tool calls that failed or produced unexpected results
- Workflows that were abandoned
- Misconceptions or incorrect assumptions
- Performance issues or timeouts
- Missing prerequisites or dependencies

### 2. Categorize Failures

#### Command Failures

```bash
# Document failed commands with:
# - The exact command that failed
# - The error message received
# - The root cause
# - The successful alternative (if found)
```

#### Tool Usage Failures

- Incorrect parameters passed to tools
- Wrong tool selection for the task
- Missing required context before tool use
- Sequencing errors in tool calls

#### Workflow Logic Failures

- Incorrect assumptions about the codebase
- Wrong problem-solving approach
- Missing edge cases
- Overlooked requirements

### 3. Create Prevention Rule Template

## <template>

description:
globs:
alwaysApply: false

---

# Avoid [Category] Workflow Failures

**DO THIS:** Check for these common issues before attempting [workflow type].

## Pre-flight Checklist

- [ ] [Prerequisite check 1]
- [ ] [Prerequisite check 2]
- [ ] [Environment verification]

## Common Failures and Solutions

### 1. [Failure Pattern Name]

**❌ What fails:**

```bash
[Failed command or approach]
```

**Error:** `[Error message]`

**✅ What works:**

```bash
[Successful alternative]
```

**Why:** [Brief explanation of root cause]

### 2. [Another Failure Pattern]

**❌ Avoid:**

- [Problematic approach]
- [Incorrect assumption]

**✅ Instead:**

- [Correct approach]
- [Valid assumption]

## Quick Reference

| If you see...   | It probably means... | Try this instead... |
| --------------- | -------------------- | ------------------- |
| [Error pattern] | [Root cause]         | [Solution]          |
| [Error pattern] | [Root cause]         | [Solution]          |

## Prevention Strategies

### Before Starting Workflow

1. **Verify Environment**

   ```bash
   [Verification commands]
   ```

2. **Check Dependencies**
   ```bash
   [Dependency checks]
   ```

### During Workflow Execution

- [Strategy 1]
- [Strategy 2]
- [Strategy 3]

### Common Misconceptions

- **Myth:** [Incorrect belief]
  **Reality:** [Correct understanding]

## Emergency Recovery

If you encounter these issues:

1. **[Issue type]:**

   ```bash
   [Recovery commands]
   ```

2. **[Another issue]:**
   ```bash
   [Recovery commands]
   ```

## Testing for Success

```bash
# Verify the fix worked
[Verification commands]
```

</template>

### 4. Analysis Checklist

- [ ] Document the exact error messages
- [ ] Identify root causes, not just symptoms
- [ ] Find patterns across multiple failures
- [ ] Test that proposed solutions actually work
- [ ] Include preventive measures, not just fixes
- [ ] Add verification steps

### 5. Example Output

When analyzing a workflow with npm installation failures:

````markdown
---
description:
globs: ['package.json', '*.lock']
alwaysApply: false
---

# Avoid NPM Installation Workflow Failures

**DO THIS:** Check for these issues before running npm commands.

## Common Failures and Solutions

### 1. Permission Denied Errors

**❌ What fails:**

```bash
npm install -g some-package
```
````

**Error:** `EACCES: permission denied`

**✅ What works:**

```bash
# Use npx instead of global install
npx some-package

# Or configure npm properly
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### 2. Lock File Conflicts

**❌ What fails:**

- Having both package-lock.json and pnpm-lock.yaml
- Switching between npm and pnpm

**✅ What works:**

- Pick one package manager and stick with it
- Delete conflicting lock files
- Use `npm ci` for clean installs

## Quick Reference

| If you see... | It probably means...   | Try this instead...               |
| ------------- | ---------------------- | --------------------------------- |
| ENOENT        | Missing file/directory | Check working directory           |
| EACCES        | Permission issue       | Use npx or fix npm prefix         |
| ERESOLVE      | Dependency conflict    | Use --force or --legacy-peer-deps |

```

## Output Format Tips
- Use ❌ and ✅ emoji for clear fail/success marking
- Include exact error messages for searchability
- Provide copy-paste ready solutions
- Group related failures together
- Add "why" explanations to prevent recurrence

## CRITICAL Reminders
🚨 **TEST** all proposed solutions before documenting
🚨 **INCLUDE** actual error messages from the conversation
🚨 **EXPLAIN** root causes, not just symptoms
🚨 **PROVIDE** preventive measures, not just fixes
```
