# Resolve PNPM Build Script Issues for Trusted Dependencies

**Your task: When `pnpm` blocks essential build scripts from trusted dependencies during installation or execution, apply one of the following solutions.**

## File Existence Check

Determine if `package.json` is present before modifying it:

```bash
ls . docs
```

Proceed according to the result.

This typically occurs because `pnpm` defaults to not running build scripts for security reasons. For well-known and trusted libraries, you may need to explicitly allow them.

## Solutions:

1.  **Allow Specific Dependencies via `package.json`:**
    To permanently allow build scripts for specific, trusted dependencies, modify your `package.json` file by adding or updating the `pnpm.onlyBuiltDependencies` field. This is the preferred method for ongoing project configurations.

    **Example (`package.json`):**

    ```json
    {
      // ... other package.json content
      "pnpm": {
        "onlyBuiltDependencies": [
          "sqlite3",
          "another-trusted-dependency-requiring-build"
        ]
      }
      // ... rest of package.json content
    }
    ```

    _This tells pnpm to allow build scripts specifically for `sqlite3` and `another-trusted-dependency-requiring-build`._

2.  **Temporarily Allow All Build Scripts During Installation (Use with Caution):**
    For a one-time installation where you need to allow all build scripts (e.g., when installing many new, trusted dependencies that require building), you can use the `--dangerously-allow-all-builds` flag with the install command.

    **Command:**

    ```bash
    pnpm install --dangerously-allow-all-builds
    ```

    - **Warning:** This flag bypasses a security feature. Use it only when you trust all dependencies being installed or built. Prefer Solution 1 for specific, ongoing needs.\*

**REMEMBER: Apply these solutions when `pnpm`'s security measures prevent necessary build scripts from _trusted_ dependencies from running. Prioritize the `package.json` configuration for persistent allowances.**
