# Update Project Workflow Context File: .cursor/rules/\_context/project.mdc

**Your primary task: Meticulously update the `./cursor/rules/_context/project.mdc` file to document project workflows. Use ONLY information found within the current project's files and documentation.**

## File Existence Check

Quickly list potential configuration files and docs:

```bash
ls . docs
```

Use the output to see which files are available to read.

## 1. Core Objective

Your goal is to populate the `./cursor/rules/_context/project.mdc` file. This file must accurately reflect the project's current configuration, technology stack, structure, standards, workflows, and tooling, serving as a central project reference.

## 2. Information Gathering (Strictly from Project Sources)

Follow these steps precisely to gather the necessary information:

### Step 1: Analyze Project Root & Configuration Files:

- List all files and directories in the project root.
- Identify and thoroughly read relevant configuration files. Examples include (but are not limited to):
  - Package management: `package.json`, `pnpm-lock.yaml`, `yarn.lock`, `pyproject.toml`, `poetry.lock`, `go.mod`, `pom.xml`, `build.gradle`, `Gemfile`, `composer.json`
  - Build tools & bundlers: `webpack.config.js`, `vite.config.js`, `rollup.config.js`, `tsconfig.json` (check for `compilerOptions`, `extends`, etc.)
  - Framework specific: `next.config.js`, `angular.json`, `vue.config.js`, `svelte.config.js`
  - Linters & formatters: `.eslintrc.js`, `.eslintignore`, `.prettierrc.js`, `.prettierignore`, `biome.json`, `ruff.toml`, `.editorconfig`
  - CI/CD: Files in `.github/workflows/`, `gitlab-ci.yml`, `Jenkinsfile`, `Dockerfile`
  - Testing: `jest.config.js`, `vitest.config.js`, `cypress.json`, `playwright.config.js`
- From these files, extract details about dependencies (and their versions), scripts (build, dev, test), language versions, tool configurations, and project settings.

### Step 2: Review Documentation and Key Code Directories:

- Thoroughly read all files located within the `docs/` directory (and its subdirectories). Prioritize `README.md`, `CONTRIBUTING.md`, architecture diagrams, technical specifications, or any documents describing the project's setup, conventions, and purpose.
- Examine the structure of main source directories (e.g., `src/`, `app/`, `lib/`, `packages/`) to understand module organization and identify key architectural patterns.

## 3. Updating `./cursor/rules/_context/project.mdc`

### Step 3: Populate the Template:

- Open the `./cursor/rules/_context.mdc` file for editing.
- Using the information gathered in Steps 1 and 2, meticulously fill in each section of the template provided below.
- **Crucial:** Adhere strictly to the template's structure and placeholders. Provide specific examples and details where requested (e.g., actual library names, version numbers, file paths).
- **Handling Missing Information:** If, after thorough investigation, specific information required by the template cannot be definitively found within the project's files or `docs/` directory, explicitly state `[Information not found in project context]` or `[N/A]` in the corresponding field. **ABSOLUTELY DO NOT invent, infer, or use external knowledge.** It is critical to indicate missing information rather than provide incorrect data.

## 4. Output Requirements

- Your SOLE output must be the fully updated content of the `./cursor/rules/_context/project.mdc` file.
- Ensure the output is valid Markdown.

---

## **REMEMBER: Your objective is to produce an accurate, detailed, and comprehensive `./cursor/rules/_context/project.mdc` file. This file MUST be populated using _only_ information extracted directly from THIS project's codebase and its documentation. Adhere strictly to the provided template. After updating the file with all available project-specific information (or marking details as 'not found'), your task is complete.**

## .cursor/rules/\_context/project.mdc Template

Use this template as guide for creating the project.mdc:

## <template>

description:
globs:
alwaysApply: true

---

# [Project Name] - Project Workflow Rules

## 1. Project Overview

goal: [Concisely describe the main purpose and goal of the project. What problem does it solve? Source from README or project vision docs.]
type: [e.g., Web Application, CLI Tool, Library, Mobile App, Backend API, Monorepo. Determine from project structure and build files.]
key features:

- [core functionality or feature 1, derived from docs or main modules]
- [core functionality or feature 2, derived from docs or main modules]
- [core functionality or feature 3, derived from docs or main modules]

## 2. Technology Stack

language(s): [e.g., TypeScript 5.x (from tsconfig.json or package.json), Python 3.11 (from pyproject.toml or runtime checks), Go 1.23 (from go.mod), Java 17 (from pom.xml or build.gradle)]
framework(s): [e.g., Next.js 15 (App Router - check next.config.js, package.json), React 19 (package.json), FastAPI (pyproject.toml, main app file), Spring Boot (pom.xml), SvelteKit (svelte.config.js)]
ui library/styling: [e.g., Tailwind CSS v4 (tailwind.config.js, package.json), Shadcn UI (components.json, registry), Material UI (package.json), CSS Modules (file extensions, build config)]
database(s): [e.g., PostgreSQL via Prisma (schema.prisma, package.json), MongoDB (connection strings, package.json), Supabase (config, client usage), SQLite via Drizzle (drizzle.config.js, package.json)]
state management: [e.g., Zustand (package.json, store files), React Context (usage in components), Redux (package.json, store setup), Pinia (package.json, store setup), None (Local State - if no dedicated library found)]
api layer: [e.g., REST (via Next.js API Routes/FastAPI), GraphQL (schema files, Apollo/Relay packages), tRPC (router definitions, client setup)]
key libraries:

- [critical dependency 1 (e.g., `axios` for HTTP, `date-fns` for dates - from package.json/pyproject.toml etc.)]
- [critical dependency 2 (e.g., `zod` for validation, `pino` for logging)]

## 3. Project Structure

main source directory: [e.g., src/, app/, packages/ - identify primary code location]
core directories: [Verify existence and common usage patterns]

- components/: [e.g., Reusable UI elements - if applicable]
- lib/ or utils/: [e.g., Shared utility functions - if applicable]
- services/ or api/: [e.g., Business logic, API interactions - if applicable]
- types/ or interfaces/: [e.g., Shared type definitions - if applicable]
- db/ or prisma/ or drizzle/: [e.g., Database schema and access - if applicable]
- tests/ or **tests**/: [e.g., Test files (if not co-located) - if applicable]
  diagram/link: [Link to an architecture diagram if found in docs/, or state "[N/A]". Do not generate one.]

## 4. Coding Standards & Conventions

language usage: [e.g., Prefer functional components (React), Use async/await (JS/TS), Strict TypeScript mode (tsconfig.json `strict: true`), Avoid `any` (TS lint rules). Source from linting configs, `CONTRIBUTING.md`.]
naming conventions:

- files/folders: [e.g., kebab-case, PascalCase - observe project files, check `CONTRIBUTING.md`]
- components: [e.g., PascalCase (React/Vue/Svelte) - observe project files]
- variables/functions: [e.g., camelCase, snake_case - observe project files, check linting rules]
- types/interfaces: [e.g., PascalCase, TPrefix or IPrefix - observe project files, check `CONTRIBUTING.md`]
  code style/formatting: [e.g., Prettier (check .prettierrc, package.json scripts), ESLint (check .eslintrc, package.json scripts), Ruff (ruff.toml), Biome (biome.json) - mention config file if present.]
  comments: [e.g., English only, JSDoc for public APIs, Minimal comments - check `CONTRIBUTING.md` or observe codebase patterns.]
  imports: [e.g., Absolute paths (@/ or tsconfig paths), Relative paths, Grouped/Sorted (check lint rules like eslint-plugin-import) - check `CONTRIBUTING.md`, linting config.]

## 5. Key Principles & Best Practices

[Source these from `CONTRIBUTING.md`, `README.md`, or high-level design documents in `docs/`. If none explicitly stated, mark as `[No explicit principles documented]`. Examples:]

- [e.g., DRY (Don't Repeat Yourself)]
- [e.g., SOLID principles for OOP]
- [e.g., Test-Driven Development (TDD)]

## 6. Testing

framework: [e.g., Jest, Vitest, Pytest, Go testing, Cypress, Playwright - from package.json, config files like jest.config.js]
types: [e.g., Unit tests required for services (from `CONTRIBUTING.md`), Integration tests for API endpoints, E2E with Playwright/Cypress - from `CONTRIBUTING.md` or test file structure.]
location: [e.g., Co-located with source files (e.g., `*.test.ts`, `*.spec.ts`), Top-level `tests/` directory - observe project structure.]
coverage expectations: [e.g., Minimum 80% coverage (from CI config or `CONTRIBUTING.md`). If not found, state `[N/A]`.]

## 7. Tooling & Workflow

package manager: [e.g., pnpm (pnpm-lock.yaml), npm (package-lock.json), yarn (yarn.lock), bun (bun.lockb), poetry (poetry.lock), uv (uv.lock) - identify from lockfile or project setup docs.]
build command(s): [e.g., `pnpm build`, `npm run build`, `make build` - from `package.json` scripts, `Makefile`, etc.]
run command(s) (dev): [e.g., `pnpm dev`, `npm start`, `python main.py`, `go run ./cmd/...` - from `package.json` scripts, `Makefile`, `README.md`.]
version control: [e.g., Git. Check for Conventional Commits (commitlint.config.js, `CONTRIBUTING.md`), PRs to `main`/`master` branch (from `CONTRIBUTING.md` or repo settings if accessible).]
ci/cd: [e.g., GitHub Actions (check `.github/workflows/`), GitLab CI (`.gitlab-ci.yml`), Jenkins (`Jenkinsfile`) - specify main jobs like lint, test, build on PR.]
ide recommendations: [e.g., VS Code with specific extensions (check `.vscode/extensions.json`). If not found, state `[N/A]`.]

## 8. (Optional) Database / API Guidelines

[Source from `docs/database.md`, `docs/api_guidelines.md`, `CONTRIBUTING.md`, or inline comments in DB/API code. If none, state `[N/A]`.]

- [e.g., Use ORM methods only, No direct SQL unless approved]
- [e.g., RESTful principles for API design, specific error response format]
- [e.g., Guidelines for database migrations (e.g., use Alembic, Prisma Migrate)]

## 9. (Optional) Specific Feature Rules

[Source from dedicated docs for complex features (e.g., `docs/authentication.md`, `docs/i18n.md`). If none, state `[N/A]`.]

- [e.g., Authentication: JWT-based, specific token handling procedures]
- [e.g., Internationalization (i18n): Use i18next, key naming conventions]
- [e.g., State Management: Rules for creating new stores, selector patterns]

## 10. (Optional) Rule Referencing

[If this project uses other `.mdc` rule files, list them here. Check the `.cursor/rules/` directory. If none, state `[N/A]`.]

- [e.g.,
  - See [typescript.mdc](mdc:.cursor/rules/typescript.mdc) for detailed TS rules.
  - Follow guidelines in [auth.mdc](mdc:.cursor/rules/auth.mdc) for authentication.
    ]
    </template>

Remember: the frontmatter for `project.mdc` must have alwaysApply set to true.

After outputting the completed `project.mdc` file, provide a concise executive summary of the major sections you filled in or updated. Keep this summary separate from the file content so the user can quickly review the changes.
