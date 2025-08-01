# Generate and Maintain `docs/TECH_STACK.md`

**Your Core Task: Create or update the `docs/TECH_STACK.md` file. This document MUST strictly adhere to the 10-section structure defined below. Populate its content SOLELY by extracting and synthesizing information from `NOTES.md`, `docs/PRD.md`, and `docs/openapi.yaml` (or equivalent API specifications). If critical information for a section is genuinely absent from these sources, and only then, insert a specific `<!-- TODO: ... -->` comment.**

## File Existence Check

Determine which of the following files are present:

```bash
ls . docs
```

Use this list before editing.

Your entire output for this rule invocation **MUST BE ONLY** the complete, raw Markdown content of the `docs/TECH_STACK.md` file.

## I. Strict Operational Constraints (MANDATORY)

- **Permitted File Operations:**
  - **Read-Only:** `NOTES.md`, `docs/PRD.md`, `docs/openapi.yaml` (or their specified equivalents if names differ but purpose is the same).
  - **Read/Write:** `docs/TECH_STACK.md` (this is the only file you will modify or create).
  - **No Other Files:** Do not access, read, or write any other files in the project.
- **Communication Protocol (ABSOLUTE):**
  - **NO Conversational Output:** You are strictly forbidden from generating ANY conversational output, commentary, preamble, introductions, or summaries before, during, or after generating the `docs/TECH_STACK.md` content.
  - **Sole Output = File Content:** Your _only_ output is the complete Markdown content intended for `docs/TECH_STACK.md`.
- **User Interaction:**
  - You operate based on an implicit or explicit request to manage `docs/TECH_STACK.md`.
  - You do not converse directly with the user during this process.
  - Deficiencies in information (requiring a TODO) are handled _within_ the `docs/TECH_STACK.md` file itself, as per the TODO logic below.

## II. The Blueprint: `docs/TECH_STACK.md` Structure & Content Source

The `docs/TECH_STACK.md` file **MUST** be organized into the following ten sections. The questions within each item of the "Tech Stack Definition Outline" (below) define the required content and also serve as the basis for any necessary `<!-- TODO: ... -->` comments if information is missing from source documents.

### Tech Stack Definition Outline (Mandatory Structure for `docs/TECH_STACK.md`)

1.  **`## 1. Project Overview & Goals`**

    - _(Informed by `docs/PRD.md`)_ Briefly, what is the project this tech stack is for?
    - _(Informed by `docs/PRD.md`)_ What are the primary goals influencing technology choices (e.g., scalability, speed of development, specific integrations, team expertise, budget)?

2.  **`## 2. Core Languages & Runtimes`**

    - What primary programming language(s) will be used for the backend? Specify version(s) if critical. Why this choice?
    - What primary programming language(s) and/or frameworks will be used for the frontend? Specify version(s) if critical. Why this choice?
    - Are there specific runtime environments required (e.g., Node.js version, Python version, JVM version, .NET version)?

3.  **`## 3. Frameworks & Libraries (Backend)`**

    - What backend frameworks are being chosen or considered (e.g., Django, Ruby on Rails, Spring Boot, Express.js, NestJS, ASP.NET Core)? Justify the choice.
    - List key libraries essential for the backend (e.g., ORM/database interaction, authentication/authorization, caching, background job processing, API documentation generation).

4.  **`## 4. Frameworks & Libraries (Frontend)`**

    - What frontend frameworks/libraries are being chosen or considered (e.g., React, Angular, Vue, Svelte, Blazor)? Justify the choice.
    - List key UI component libraries (e.g., Material UI, Bootstrap, Tailwind CSS, Ant Design) or state management solutions (e.g., Redux, Zustand, Pinia, NgRx) to be used.

5.  **`## 5. Database & Data Storage`**

    - _(Consider data types/relationships in `docs/PRD.md`)_ What type of database is required (e.g., Relational/SQL, NoSQL Document, NoSQL Key-Value, Graph, Time Series)? Why?
    - Specify the chosen database system(s) (e.g., PostgreSQL, MySQL, MongoDB, Cassandra, Neo4j, InfluxDB).
    - Are other data storage solutions needed (e.g., caching like Redis/Memcached, object storage like AWS S3/Google Cloud Storage, message queues like RabbitMQ/Kafka)?

6.  **`## 6. Infrastructure & Deployment`**

    - Where will the application be hosted (e.g., AWS, Azure, GCP, DigitalOcean, Vercel, Netlify, on-premise)?
    - What specific services will be used (e.g., EC2, Lambda, Azure App Service, Google Kubernetes Engine)?
    - What containerization technologies will be used (e.g., Docker, Podman)? Orchestration (e.g., Kubernetes, Docker Swarm)?
    - What CI/CD tools and processes are planned (e.g., Jenkins, GitLab CI, GitHub Actions, CircleCI)?

7.  **`## 7. APIs & Integrations`**

    - _(Reference `docs/PRD.md` and `docs/openapi.yaml`)_ Will the project expose its own APIs? If so, what style (e.g., REST, GraphQL, gRPC, WebSockets)?
    - _(Reference `docs/PRD.md`)_ What critical third-party services or APIs will be integrated (e.g., payment gateways like Stripe/PayPal, identity providers like Auth0/Okta, analytics services, communication services like Twilio/SendGrid)?

8.  **`## 8. Development Tools & Standards`**

    - What version control system will be used (e.g., Git)? Where will repositories be hosted (e.g., GitHub, GitLab, Bitbucket)?
    - Are there specific IDEs, linters (e.g., ESLint, Pylint), or code formatting standards (e.g., Prettier, Black)?
    - _(Reference `docs/PRD.md` for acceptance criteria)_ What testing frameworks and strategies will be employed (e.g., Jest, PyTest, JUnit, Cypress, Selenium; unit, integration, E2E testing)?

9.  **`## 9. Security Considerations`**

    - _(Reference `docs/PRD.md` for security requirements)_ What are the key security requirements for the chosen technologies (e.g., OWASP Top 10 mitigations)?
    - Are there specific libraries, tools, or practices for security (e.g., for authentication, authorization, input validation, data encryption, dependency scanning, secrets management)?

10. **`## 10. Rationale & Alternatives Considered`**
    - For major technology choices (especially languages, frameworks, databases, hosting), briefly explain the rationale and any significant alternatives that were considered and why they were not chosen.

## III. Workflow for Generating/Updating `docs/TECH_STACK.md`

1.  **Access Source Documents:**

    - Read the content of `NOTES.md` (if provided as an input or found).
    - Read the content of `docs/PRD.md`.
    - Read the content of `docs/openapi.yaml` (or equivalent API spec) if it exists.
    - _These are your ONLY sources of information for populating `docs/TECH_STACK.md`._ If these documents are missing or sparse, the `TECH_STACK.md` will reflect that (potentially with TODOs).
    - Read the current content of `docs/TECH_STACK.md` if it already exists.

2.  **Manage `docs/TECH_STACK.md` Content:**

    - **Initialization:** If `docs/TECH_STACK.md` does not exist, create it. Your output will be the initial version containing all ten section headers (as listed in the "Tech Stack Definition Outline") followed by content or TODOs as per the logic below.
    - **Content Integration (Section by Section):** For each of the ten mandatory sections:
      - Review `NOTES.md`, `docs/PRD.md`, and `docs/openapi.yaml` (and `TECH_STACK.md` itself if updating) for information relevant to _that specific section_.
      - Synthesize and write the information into the corresponding section of your `docs/TECH_STACK.md` output. If updating existing content, intelligently merge or replace based on the latest available information from the source documents. Aim for comprehensive but concise statements directly addressing the questions in the outline.

3.  **Identify Gaps & Insert TODOs (Strict Logic):**

    - After attempting to populate a section using **all three source documents** (`NOTES.md`, `docs/PRD.md`, `docs/openapi.yaml`):
      - A `<!-- TODO: ... -->` comment **MUST ONLY** be inserted if the section in your generated `docs/TECH_STACK.md` remains **genuinely empty** OR contains only placeholder text (e.g., a simple rephrasing of the section title without any substantive information from the sources) OR if critical information explicitly requested by that section's definition (as per the "Tech Stack Definition Outline") is **clearly missing** and **cannot be found in any of the specified source documents**.
      - **DO NOT** insert a TODO if the section has been populated with _any_ relevant information from the source files, even if that information could theoretically be more detailed or elaborated upon. The purpose of the TODO is to flag _critically missing information that was not found in the designated sources_, not to solicit further details on already present information.
      - **TODO Comment Format:** `<!-- TODO: [Question from the "Tech Stack Definition Outline" for the missing piece of information. Include examples if helpful.] -->`
        - Example for section 1 if project goals are missing from PRD: `<!-- TODO: What are the primary goals influencing technology choices (e.g., scalability, speed of development, specific integrations, team expertise, budget)? (This should be in docs/PRD.md) -->`
        - Example for section 2 if backend language choice isn't found: `<!-- TODO: What primary programming language(s) will be used for the backend? Specify version(s) if critical. Why this choice? -->`

4.  **Final Output:** Your _sole output_ is the complete, updated content of `docs/TECH_STACK.md`.

Immediately after providing this file content, output a short executive summary of the key sections you filled in or marked with TODOs. This summary should come after the file content and remain separate from it.

**REMEMBER: Your output MUST ONLY be the full Markdown content for `docs/TECH_STACK.md`. Populate it strictly from `NOTES.md`, `docs/PRD.md`, and `docs/openapi.yaml`. Follow the 10-section structure. Insert `<!-- TODO: ... -->` comments (containing the guiding question from the outline) ONLY for sections where critical information is verifiably absent from all specified source documents.**
