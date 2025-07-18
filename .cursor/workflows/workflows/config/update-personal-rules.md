# Create User Environment File: .cursor/rules/\_/<username>.mdc

**Your primary task: Create a user environment file that captures the developer's system configuration and available tools for workflows.**

## Capture System Environment

### Determine User Identity & System Info

```bash
# Capture git username
GH_USER=$( (gh api user --jq .login 2>/dev/null || git config user.username || git config user.name || whoami) \
  | tr '[:upper:]' '[:lower:]' \
  | xargs \
  | tr ' ' '-' \
  | tr -d '\n' )

# Capture system information
OS_NAME=$(uname -s)
OS_VERSION=$(uname -r)
HOSTNAME=$(hostname)
SHELL_NAME=$(basename "$SHELL")
HOME_DIR=$HOME
CURRENT_DIR=$(pwd)

# Detect package managers
HAS_HOMEBREW=$(command -v brew >/dev/null && echo "Yes" || echo "No")
HAS_NPM=$(command -v npm >/dev/null && echo "Yes" || echo "No")
HAS_PNPM=$(command -v pnpm >/dev/null && echo "Yes" || echo "No")
HAS_YARN=$(command -v yarn >/dev/null && echo "Yes" || echo "No")
HAS_BUN=$(command -v bun >/dev/null && echo "Yes" || echo "No")
HAS_POETRY=$(command -v poetry >/dev/null && echo "Yes" || echo "No")
HAS_UV=$(command -v uv >/dev/null && echo "Yes" || echo "No")
HAS_CARGO=$(command -v cargo >/dev/null && echo "Yes" || echo "No")
HAS_PIPX=$(command -v pipx >/dev/null && echo "Yes" || echo "No")

# Detect development tools
HAS_DOCKER=$(command -v docker >/dev/null && echo "Yes" || echo "No")
HAS_GIT=$(command -v git >/dev/null && echo "Yes" || echo "No")
HAS_GH=$(command -v gh >/dev/null && echo "Yes" || echo "No")
HAS_CODE=$(command -v code >/dev/null && echo "Yes" || echo "No")
HAS_CURSOR=$(command -v cursor >/dev/null && echo "Yes" || echo "No")
HAS_NVIM=$(command -v nvim >/dev/null && echo "Yes" || echo "No")
HAS_VIM=$(command -v vim >/dev/null && echo "Yes" || echo "No")
HAS_TMUX=$(command -v tmux >/dev/null && echo "Yes" || echo "No")
HAS_ZELLIJ=$(command -v zellij >/dev/null && echo "Yes" || echo "No")

# Additional dev tools
HAS_RIPGREP=$(command -v rg >/dev/null && echo "Yes" || echo "No")
HAS_FZF=$(command -v fzf >/dev/null && echo "Yes" || echo "No")
HAS_BAT=$(command -v bat >/dev/null && echo "Yes" || echo "No")
HAS_EZA=$(command -v eza >/dev/null && echo "Yes" || echo "No")
HAS_FD=$(command -v fd >/dev/null && echo "Yes" || echo "No")
HAS_DIRENV=$(command -v direnv >/dev/null && echo "Yes" || echo "No")

# Runtime versions
NODE_VERSION=$(node --version 2>/dev/null || echo "N/A")
PYTHON_VERSION=$(python3 --version 2>/dev/null | cut -d' ' -f2 || echo "N/A")
GO_VERSION=$(go version 2>/dev/null | cut -d' ' -f3 || echo "N/A")
RUST_VERSION=$(rustc --version 2>/dev/null | cut -d' ' -f2 || echo "N/A")
RUBY_VERSION=$(ruby --version 2>/dev/null | cut -d' ' -f2 || echo "N/A")

# Display collected info
echo "=== User Environment Detected ==="
echo "Username: $GH_USER"
echo "OS: $OS_NAME $OS_VERSION"
echo "Hostname: $HOSTNAME"
echo "Shell: $SHELL_NAME"
echo "Home: $HOME_DIR"
echo "Current Dir: $CURRENT_DIR"
echo ""
echo "=== Runtime Versions ==="
echo "Node.js: $NODE_VERSION"
echo "Python: $PYTHON_VERSION"
echo "Go: $GO_VERSION"
echo "Rust: $RUST_VERSION"
echo "Ruby: $RUBY_VERSION"
```

### Windows-Specific Detection

For Windows users, also run:

```powershell
# If on Windows (PowerShell)
$env:USERNAME
$env:COMPUTERNAME
[System.Environment]::OSVersion
$PSVersionTable

# Check for tools
Get-Command npm,pnpm,yarn,git,docker,code,cursor -ErrorAction SilentlyContinue | Select-Object Name,Version

# Check for WSL
wsl --list --verbose 2>$null
```

## Create User Environment File

Create/update the `./cursor/rules/_/<username>.mdc` file with the template below, filling in the detected values.

---

## User Environment Template: .cursor/rules/\_/<username>.mdc

## <template>

description:
globs:
alwaysApply: true

---

# Developer Workflow Environment: [username]

## System Information

**Developer:** [username from git/system]
**Operating System:** [OS Name] [OS Version]
**Hostname:** [hostname]
**Shell:** [shell name]
**Home Directory:** [home path]
**Current Directory:** [current working directory]

## Available Package Managers

### JavaScript/Node

- npm: [Yes/No]
- pnpm: [Yes/No]
- yarn: [Yes/No]
- bun: [Yes/No]

### Python

- pip/pip3: [Yes/No]
- poetry: [Yes/No]
- uv: [Yes/No]
- pipx: [Yes/No]

### Other Languages

- cargo (Rust): [Yes/No]
- homebrew: [Yes/No - macOS/Linux]

## Development Tools

### Version Control

- Git: [Yes/No]
- GitHub CLI (gh): [Yes/No]

### Editors/IDEs

- VS Code: [Yes/No]
- Cursor: [Yes/No]
- Neovim: [Yes/No]
- Vim: [Yes/No]

### Terminal Tools

- tmux: [Yes/No]
- zellij: [Yes/No]
- ripgrep (rg): [Yes/No]
- fzf: [Yes/No]
- bat: [Yes/No]
- eza/exa: [Yes/No]
- fd: [Yes/No]
- direnv: [Yes/No]

### Containerization

- Docker: [Yes/No]

## Runtime Versions

- Node.js: [version or N/A]
- Python: [version or N/A]
- Go: [version or N/A]
- Rust: [version or N/A]
- Ruby: [version or N/A]

## System-Specific Configuration

### Platform Notes

[e.g., "macOS Sonoma with Homebrew", "Ubuntu 22.04 with apt", "Windows 11 with WSL2", "Arch Linux with pacman"]

### Preferred Package Manager

Based on availability: [npm/pnpm/yarn/bun]

### Shell Configuration

- Shell: [bash/zsh/fish/powershell]
- Config file: [.bashrc/.zshrc/.config/fish/config.fish]

## Workflow Preferences

### Command Shortcuts

```bash
# Based on available tools, use these optimized commands:

# File searching (using [rg/grep])
[rg pattern or grep -r pattern .]

# File listing (using [eza/ls])
[eza -la or ls -la]

# File finding (using [fd/find])
[fd pattern or find . -name pattern]

# Git operations (using [gh/git])
[gh pr create or git push]
```

### Environment-Specific Workflow Recommendations

- Use [detected package manager] for JavaScript projects
- Use [detected Python tool] for Python environments
- Editor: [VS Code/Cursor/Neovim] detected and recommended
- Terminal multiplexer: [tmux/zellij] available

## Personal Workflow Notes

[Space for user to add their own notes]

- Preferred workflows
- Custom aliases
- Project-specific configurations
  </template>

**IMPORTANT:**

- This file captures YOUR workflow environment
- Update it when you install new tools or change systems
- Use it to inform AI assistants about your available tools
- Keep it in the `_/` directory so it's personal to you
