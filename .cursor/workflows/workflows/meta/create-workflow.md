# Create New Workflow .mdc File from Conversation

**🎯 PRIMARY OBJECTIVE:** Create an ACTUAL .mdc file in the appropriate workflows subdirectory that captures reusable patterns from this conversation.

## 🚨 CRITICAL: You MUST Create a File

**DO THIS IMMEDIATELY:**

1. Analyze the conversation to identify the workflow pattern
2. Determine the appropriate subdirectory under `.cursor/rules/workflows/`
3. Create a new `.mdc` file at the EXACT path: `.cursor/rules/workflows/[subdirectory]/[filename].mdc`
4. Write the complete workflow content following the template below

## Step 1: Identify Workflow Category

Determine which subdirectory the new workflow belongs in under `.cursor/rules/workflows/`:

- `.cursor/rules/workflows/analysis/` - For analyzing code, logs, or patterns
- `.cursor/rules/workflows/config/` - For configuration or setup workflows
- `.cursor/rules/workflows/dependencies/` - For dependency management workflows
- `.cursor/rules/workflows/docs/` - For documentation-related workflows
- `.cursor/rules/workflows/github/` - For GitHub-specific workflows
- `.cursor/rules/workflows/meta/` - For workflow creation/management workflows
- `.cursor/rules/workflows/project/` - For project-level workflows
- `.cursor/rules/workflows/prompts/` - For prompt engineering workflows
- `.cursor/rules/workflows/task/` - For task execution workflows
- **Create new subdirectory** under `.cursor/rules/workflows/` if needed for specialized workflows

## Step 2: Choose Descriptive Filename

Create a filename that clearly indicates the workflow's purpose:

- Use kebab-case: `analyze-performance.mdc`, `setup-testing.mdc`
- Be specific: `migrate-database-postgres.mdc` not just `database.mdc`
- Include action verbs: `create-`, `update-`, `analyze-`, `setup-`

## Step 3: Extract Workflow Components

### From the Conversation, Identify:

1. **Primary Goal** - What did we accomplish?
2. **Key Steps** - What sequence of actions did we take?
3. **Tools Used** - Which commands, scripts, or tools were involved?
4. **Decision Points** - Where did we make choices?
5. **Error Handling** - What problems did we encounter and solve?
6. **Verification** - How did we confirm success?

## Step 4: Create the .mdc File

**USE THIS EXACT TEMPLATE:**

````markdown
---
description:
globs:
  [Optional: file patterns this workflow applies to, e.g., '*.json', '**/*.ts']
alwaysApply: false
---

# [Workflow Title - Action-Oriented]

**DO THIS:** [Primary directive - one clear sentence stating the main task]

## Prerequisites

- [Required tool/permission/setup item 1]
- [Required tool/permission/setup item 2]
- [Any specific context or conditions]

## Workflow Steps

### 1. [First Major Step Name]

[Brief description of what this step accomplishes]

```bash
# Actual commands from the conversation
[command 1]
[command 2]
```
````

**Expected Output:**

```
[Example of what success looks like]
```

### 2. [Second Major Step Name]

[Brief description]

[Instructions or code blocks]

### 3. [Verification Step - ALWAYS INCLUDE]

Confirm the workflow succeeded:

```bash
[Verification commands]
```

## Parameters

| Parameter | Description        | Default         | Example         |
| --------- | ------------------ | --------------- | --------------- |
| [param1]  | [what it controls] | [default value] | [example usage] |

## Common Issues & Solutions

### Issue: [Problem that might occur]

**Solution:**

```bash
[Commands to fix it]
```

## Example Usage

Trigger this workflow with:

```
"[Simple prompt that would invoke this workflow]"
```

## Notes

- [Important consideration or limitation]
- [Alternative approach if main method fails]
- [Cross-platform compatibility notes if applicable]

````

## Step 5: EXECUTE THE FILE CREATION

**🚨 YOU MUST NOW:**
1. Use the Write tool to create the .mdc file at the EXACT path
2. The path MUST be: `.cursor/rules/workflows/[subdirectory]/[descriptive-filename].mdc`
3. Include ALL workflow steps from our conversation
4. Make it immediately reusable for similar tasks

## Example File Creation Commands

**For a database migration workflow:**
```bash
# Create the subdirectory if needed
mkdir -p .cursor/rules/workflows/database

# Create the file at the EXACT path
Write: .cursor/rules/workflows/database/migrate-postgres-schema.mdc
````

**For an API testing workflow:**

```bash
# Use existing or create new subdirectory
Write: .cursor/rules/workflows/testing/api-integration-tests.mdc
```

**REMEMBER:** The file MUST be created under `.cursor/rules/workflows/` - nowhere else!

## Final Checklist Before Creating File

- [ ] Identified the correct subdirectory
- [ ] Chosen a descriptive, action-oriented filename
- [ ] Extracted all key steps from the conversation
- [ ] Included actual commands and code used
- [ ] Added verification steps
- [ ] Documented any parameters or variables
- [ ] Included example usage
- [ ] Made it generic enough to be reusable

## 🎯 REMEMBER: Your SUCCESS is measured by whether you CREATE AN ACTUAL .mdc FILE

The conversation analysis is only the first step. You MUST create a real file at the path:
`.cursor/rules/workflows/[subdirectory]/[filename].mdc`

If you don't create a file at this exact location, you have failed this task.

**THE FILE MUST BE CREATED AT:** `.cursor/rules/workflows/[appropriate-subdirectory]/[descriptive-filename].mdc`
