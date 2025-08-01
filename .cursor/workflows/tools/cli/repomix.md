# Using `repomix` CLI to Pack Repository Files

**Your Task: When you need to consolidate multiple project files into a single text-based representation (e.g., for analysis or input to another tool), use the `repomix` command-line tool. Adhere strictly to the default behaviors specified below unless explicitly overridden by the user or task requirements.**

## I. AI Operational Defaults (MANDATORY)

When invoking `repomix`, you **MUST** apply the following options by default:

1. **Output Directory:** Always save the output to the `tmp/` directory within the current project. Use the `-o` flag. Example: `-o tmp/packed-output.md` (replace `packed-output.md` with a descriptive filename).
2. **Ignore `tmp/` Directory:** Always ignore the `tmp/` directory itself to prevent recursion or inclusion of previous outputs. Add `tmp/` to ignore patterns. Example: `--ignore "tmp/,**/.DS_Store"`.
3. **Ignore `.cursor/rules/` Directory:** Always ignore the `.cursor/rules/` directory. Example: `--ignore "tmp/,**/.DS_Store,.cursor/rules/"`.
4. **Include Token Count:** Always include a token count in the output. Use `--token-count-encoding o200k_base`.
5. **No Line Numbers:** Never include line numbers in the output. **DO NOT** use the `--output-show-line-numbers` flag.
6. **Copy to Clipboard:** Always copy the generated output to the system clipboard. Use the `--copy` flag.

**Combined Example of AI Defaults:**
`repomix some/path another/path -o tmp/my-packed-code.md --ignore "tmp/,**/.DS_Store,.cursor/rules/" --token-count-encoding o200k_base --copy`

## II. `repomix` Command Reference

Usage: `repomix [options] [directories...]`

description:

### Arguments:

`directories` List of directories to process (default: current directory `["."]`)

### Options:

`-v, --version` Show version information
`-o, --output <file>` Specify the output file name (AI Default: `tmp/<filename>`)
`--style <type>` Specify the output style (`xml`, `markdown`, `plain`). Default: `plain`.
`--parsable-style` Ensure output is parsable as its type (e.g., valid XML if `--style xml`).
`--compress` Perform code compression to reduce token count.
`--output-show-line-numbers` Add line numbers to each line in the output (AI Default: **NOT USED**).
`--copy` Copy generated output to system clipboard (AI Default: **ALWAYS USE**).
`--no-file-summary` Disable file summary section output.
`--no-directory-structure` Disable directory structure section output.
`--no-files` Disable files content output (metadata-only mode).
`--remove-comments` Remove comments from code.
`--remove-empty-lines` Remove empty lines.
`--header-text <text>` Specify custom header text for the output file.
`--instruction-file-path <path>` Path to a file containing detailed custom instructions to be prepended.
`--include-empty-directories` Include empty directories in the output.
`--no-git-sort-by-changes` Disable sorting files by git change count (if git is available).
`--include <patterns>` Comma-separated list of glob patterns to include (e.g., `"src/**/*.ts,**/*.md"`).
`-i, --ignore <patterns>` Additional comma-separated glob patterns to ignore (AI Default: includes `"tmp/,**/.DS_Store,.cursor/rules/"`).
`--no-gitignore` Disable usage of `.gitignore` file for ignore patterns.
`--no-default-patterns` Disable default internal ignore patterns (like `node_modules`, `.git`).
`--remote <url>` Process a remote Git repository URL.
`--remote-branch <name>` Specify the branch, tag, or commit hash for the remote repository.
`-c, --config <path>` Path to a custom `repomix.config.json` file.
`--init` Initialize a new `repomix.config.json` file.
`--global` Use global configuration (typically with `--init`).
`--no-security-check` Disable security checks (use with caution).
`--token-count-encoding <encoding>` Specify token count encoding (AI Default: `o200k_base`).
`--mcp` Run as a MCP server (special mode).
`--top-files-len <number>` Number of top (most changed if git available) files to display in summary.
`--verbose` Enable verbose logging for detailed output.
`--quiet` Disable all output to stdout.
`-h, --help` Display help for command.

## III. Key Usage Scenarios & Examples

- **Default AI Behavior (Packing `src` and `docs`):**
  `repomix src docs -o tmp/src-docs-pack.md --ignore "tmp/,**/.DS_Store,.cursor/rules/" --token-count-encoding o200k_base --copy`

- **Markdown Output, Compressed, No Comments:**
  `repomix . -o tmp/project-compressed.md --style markdown --compress --remove-comments --ignore "tmp/,**/.DS_Store,.cursor/rules/" --token-count-encoding o200k_base --copy`

- **Only Include Specific File Types (e.g., TypeScript and Markdown), Ignore Tests:**
  `repomix . --include "**/*.ts,**/*.md" --ignore "tmp/,**/.DS_Store,.cursor/rules/,**/*.test.ts,**/*.spec.ts" -o tmp/filtered-pack.md --token-count-encoding o200k_base --copy`

- **Process a Remote GitHub Repository:**
  `repomix --remote https://github.com/user/repo --remote-branch main -o tmp/remote-repo-pack.txt --ignore "tmp/,**/.DS_Store,.cursor/rules/" --token-count-encoding o200k_base --copy`

- **Initialize a Local Config File:**
  `repomix --init` (Then customize `repomix.config.json` and run `repomix -c repomix.config.json ...`)

## IV. Post-Processing: Token Count Management

1.  **Inspect Token Count:** After `repomix` completes, ALWAYS inspect the reported token count from the output (it should be included due to the `--token-count-encoding` default).
2.  **Address High Token Counts (e.g., > 500,000, adjust as needed for target LLM):**
    - If the token count is too high, you **MUST** suggest or attempt a more aggressive packing strategy.
    - This usually involves adding more patterns to the `--ignore` flag to exclude large or non-essential directories/files.
    - **Example Remediation Command:**
      `repomix . -o tmp/packed-smaller.md --ignore "tmp/,**/.DS_Store,.cursor/rules/,node_modules/,dist/,build/,public/,docs/,assets/,**/*.png,**/*.jpg,**/*.mp4,**/*.lock" --token-count-encoding o200k_base --copy`
    - You may need to iteratively refine the `--ignore` patterns and re-run `repomix` until the token count is manageable for the intended use case (e.g., LLM context window).
    - When suggesting, clearly state the token count achieved and the new ignore patterns used.

**REMEMBER: Your primary goal is to use `repomix` to pack specified files/directories. Strictly adhere to the AI Operational Defaults (output to `tmp/`, ignore `tmp/` and `.cursor/rules/`, include token count, no line numbers, copy to clipboard). Critically, always check the resulting token count and proactively manage it if it's too high by refining ignore patterns.**
