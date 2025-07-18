# Audit Project Dependencies

**Your task: Perform a comprehensive audit of project dependencies, checking for outdated packages, security vulnerabilities, and optimization opportunities.**

## Step 1: Identify Package Manager and Lock Files

```bash
ls -la | grep -E "(package-lock|yarn.lock|pnpm-lock|Pipfile.lock|poetry.lock|go.sum|Cargo.lock)"
```

Based on what you find, use the appropriate commands below.

## Step 2: Check for Outdated Dependencies

### For JavaScript/TypeScript Projects:

```bash
# For npm
npm outdated

# For pnpm
pnpm outdated

# For yarn
yarn outdated
```

### For Python Projects:

```bash
# For pip
pip list --outdated

# For poetry
poetry show --outdated
```

### For Go Projects:

```bash
go list -u -m all
```

## Step 3: Security Vulnerability Scan

### JavaScript/TypeScript:

```bash
# npm
npm audit

# pnpm
pnpm audit

# yarn
yarn audit
```

### Python:

```bash
# Install safety if not present
pip install safety
safety check
```

### Go:

```bash
# Install nancy if not present
go install github.com/sonatype-nexus-community/nancy@latest
go list -json -m all | nancy sleuth
```

## Step 4: Analyze Findings

Create a summary report analyzing:

1. **Critical Security Issues**: List any high/critical vulnerabilities
2. **Major Version Updates**: Dependencies with breaking changes
3. **Minor/Patch Updates**: Safe updates that can be applied immediately
4. **Unused Dependencies**: Check for packages that might not be in use
5. **License Compliance**: Verify all licenses are compatible with project

## Step 5: Create Update Plan

Generate a structured plan in `docs/dependency-audit-YYYY-MM-DD.md`:

````markdown
# Dependency Audit Report - [DATE]

## Summary

- Total dependencies: X
- Outdated: Y
- Security issues: Z

## Critical Security Updates (Apply Immediately)

| Package | Current | Vulnerable | Fixed | CVE          |
| ------- | ------- | ---------- | ----- | ------------ |
| example | 1.0.0   | <1.2.0     | 1.2.0 | CVE-2024-XXX |

## Major Version Updates (Requires Testing)

| Package | Current | Latest | Breaking Changes          |
| ------- | ------- | ------ | ------------------------- |
| react   | 17.0.2  | 18.2.0 | [Link to migration guide] |

## Safe Updates (Minor/Patch)

```bash
# Commands to apply safe updates
pnpm update package1 package2 package3
```
````

## Recommendations

1. Apply security patches immediately
2. Schedule major updates for next sprint
3. Consider replacing deprecated packages

````

## Step 6: Apply Safe Updates

For packages with only patch/minor updates:

```bash
# Create a new branch
git checkout -b chore/dependency-updates-YYYY-MM-DD

# Apply updates based on package manager
pnpm update --recursive --latest --prod  # for production deps only
# or
npm update

# Run tests
pnpm test

# Commit if tests pass
git add -A
git commit -m "chore: update dependencies (security patches and minor updates)"
````

## Step 7: Handle Major Updates

For each major update:

1. **Create separate branch**: `feat/update-[package]-to-v[X]`
2. **Review migration guide**: Check package documentation
3. **Update incrementally**: One major package at a time
4. **Add tests**: Ensure coverage for affected areas
5. **Document changes**: Update relevant documentation

## Step 8: Clean Up Unused Dependencies

### Find unused dependencies:

```bash
# For JavaScript projects, install depcheck
pnpm add -g depcheck
depcheck

# Review the output and remove truly unused packages
pnpm remove unused-package-1 unused-package-2
```

## Step 9: Update Lock Files

Always regenerate lock files after updates:

```bash
# Delete and regenerate
rm pnpm-lock.yaml
pnpm install

# Verify everything still works
pnpm test
pnpm build
```

## Step 10: Document and Communicate

1. **Update README**: If minimum versions changed
2. **Update CI/CD**: If Node/Python/Go version requirements changed
3. **Notify team**: Create PR with audit summary
4. **Schedule follow-ups**: For deferred major updates

## Best Practices

- Run audits monthly or after major features
- Automate with CI/CD where possible
- Keep audit reports for compliance
- Prioritize security over features
- Test thoroughly after updates
- Use exact versions in production

**REMEMBER: Security updates are critical. Apply them immediately. Major updates need careful planning and testing.**
