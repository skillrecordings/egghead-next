# Glob-Based Rules Directory

This directory contains rules organized by the file patterns they apply to.

## Directory Naming Convention

Since file systems don't allow certain characters (like `*`, `/`, etc.) in directory names, we use descriptive names that represent the glob patterns. Examples:

- `react/` - Rules for React component files (`**/*.{ts,tsx,js,jsx}`)
- `typescript/` - Rules for TypeScript source files (`src/**/*.ts`)
- `config/` - Rules for configuration files (`**/*.config.{js,ts}`)
- `test/` - Rules for test files (`**/*.{test,spec}.{js,ts}`)
- `cli/` - Rules for CLI tools (`**/*.{sh,bash,zsh}`)
- `docs/` - Rules for documentation files (`**/*.{md,mdx}`)
- `task/` - Rules for task files (`**/*.{md,mdx}`)

## How It Works

Each rule file in these directories should specify the actual glob patterns in its frontmatter:

```yaml
---
globs: '**/*.{ts,tsx,js,jsx}'
---
```

The directory name is just a human-readable representation of what files the rules apply to.
