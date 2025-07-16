# Cursor Rules README

## Overview

This directory contains rules that guide AI behavior in your development workflow. Rules are organized by category and can be automatically or manually invoked based on your needs.

## Locally Overriding Rules (Without Affecting Your Team)

Sometimes you may want to customize certain rules for your personal workflow without pushing those changes to the team repository. Git provides a way to ignore local changes to tracked files.

### How to Override Rules Locally

1. **Make your local changes** to any rule file (e.g., modify `_core/persona.mdc` to be less aggressive)

2. **Tell Git to ignore your local changes:**

   ```bash
   git update-index --assume-unchanged .cursor/rules/_core/persona.mdc
   ```

3. **Git will now:**
   - Ignore any modifications you make to that file
   - Not show the file in `git status`
   - Not include it in commits
   - Keep the original version in the repository for your team

### Common Use Cases

- **Persona adjustments**: Make the AI less aggressive or more conversational
- **Communication style**: Add more detailed explanations if you prefer
- **Package managers**: Use npm/yarn instead of pnpm for personal projects
- **Git practices**: Adjust commit message formats for personal preferences

### Reverting Back

To make Git track changes again:

```bash
git update-index --no-assume-unchanged .cursor/rules/_core/persona.mdc
```

### Example: Overriding Multiple Rules

```bash
# Make the AI less aggressive and more verbose
git update-index --assume-unchanged .cursor/rules/_core/persona.mdc
git update-index --assume-unchanged .cursor/rules/_core/communication.mdc

# Use npm instead of pnpm
git update-index --assume-unchanged .cursor/rules/_core/standards.mdc
```

### Important Notes

- This only affects your local repository
- The original files remain unchanged for your team
- Pull/merge operations won't overwrite your local changes
- New team members will get the standard rules
- Your overrides won't be included if you create patches or diffs

### Personal Rules Directory

The `_/` directory is reserved for personal rules and is **not tracked by Git**. This is the perfect place to:

- Create completely custom rules just for yourself
- Experiment with new rule ideas
- Store personal workflow preferences
- Keep project-specific overrides

Example:

```bash
# Create a personal rule that won't be shared with the team
echo "---
description: My personal debugging helper
globs:
alwaysApply: false
---
# Personal Debugging Assistant

Always add console.log statements with emoji prefixes for my debugging style.
" > .cursor/rules/_/my-debug-helper.mdc
```

### Best Practices

1. **Use `_/` for new personal rules**: Don't clutter the team directories
2. **Use `--assume-unchanged` for tweaking team rules**: When you just need small adjustments
3. **Document your overrides**: Keep a personal note of which files you've overridden
4. **Review periodically**: Check if team updates to rules might benefit you
5. **Share useful patterns**: If your override improves workflow significantly, consider proposing it to the team

This approach lets you customize your AI assistant's behavior while maintaining team consistency!
