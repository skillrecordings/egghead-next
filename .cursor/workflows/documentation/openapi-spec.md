## OpenAPI Specification Management Rule

_This rule guides the creation and maintenance of the `docs/openapi.yaml` file._

## File Existence Check

Before editing, determine which related docs already exist:

```bash
ls . docs
```

Use this information to inform the following steps.

### Core Directive

Create and maintain an `docs/openapi.yaml` file, defining an OpenAPI specification (v3.0.x or 3.1.x). Operate based on information from `NOTES.md`, `docs/PRD.md`, `docs/TECH_STACK.md`, and the existing `docs/openapi.yaml` (if present), ensuring adherence to the OpenAPI structure outlined below.

### Strict Limitations

- **File Operations:** Only read `NOTES.md`, `docs/PRD.md`, `docs/TECH_STACK.md`, `docs/openapi.yaml` (or equivalents), and read/write to `docs/openapi.yaml`. Do not interact with other files.
- **Output Format:** Your entire output must be the content of the `docs/openapi.yaml` file itself.
- **Communication:** You are forbidden from generating any conversational output, commentary, preamble, or summaries outside of the `docs/openapi.yaml` file.
- **User Interaction (within `docs/openapi.yaml`):** You do not directly converse with the user. If sections of the `docs/openapi.yaml` are incomplete or require clarification, you will indicate this _within the `docs/openapi.yaml` file_ using a specific YAML comment format.

### OpenAPI Specification Structure and Content Source

The `docs/openapi.yaml` file must follow the structure below, derived from the "OpenAPI Specification Outline" questions. Aim for OpenAPI version 3.0.x or 3.1.x.

#### OpenAPI Specification Outline (Source for `docs/openapi.yaml` Structure and TODOs)

1.  **OpenAPI Version & Basic Information (`openapi`, `info` block):**

    - Specify the OpenAPI version (e.g., `openapi: 3.0.3`).
    - **Title (`info.title`):** What is the official title for this API? (Source: `docs/PRD.md` - Project Name/Title. Example: "Customer Data API").
    - **Version (`info.version`):** What is the current version of this API specification (e.g., "1.0.0", "v2.1-beta")?
    - **Description (`info.description`):** Provide a brief description of the API's purpose and capabilities. (Source: `docs/PRD.md` - Project Purpose/Core Functionality. Example: "API for managing customer profiles and order history.").
    - **(Optional) Contact (`info.contact`):**
      - `name`: Contact person/team name (e.g., "API Support Team").
      - `url`: URL to a support page or contact form.
      - `email`: Contact email address (e.g., "apisupport@example.com").
    - **(Optional) License (`info.license`):**
      - `name`: SPDX license identifier (e.g., "Apache 2.0", "MIT").
      - `url`: Link to the full license text.

2.  **Server Configuration (`servers` block):**

    - What are the base URLs for accessing the API? (Source: `docs/TECH_STACK.md` - Infrastructure & Deployment. Examples: `https://api.example.com/v1`, `https://sandbox.api.example.com/v1`).
    - For each server, provide:
      - `url`: The server URL.
      - `description`: A human-readable description (e.g., "Production Server", "Sandbox Environment").

3.  **Global Security Definitions (`components.securitySchemes` & `security` block):**

    - What authentication/authorization methods will this API use? (Source: `docs/TECH_STACK.md` - Security Considerations. Examples: API Key, OAuth2, JWT Bearer Token).
    - Define each scheme under `components.securitySchemes`:
      - **API Key Example (`apiKeyAuth`):**
        - `type: apiKey`
        - `in: header` (or `query`, `cookie`)
        - `name: X-API-KEY` (the name of the header or query parameter)
      - **OAuth2 Example (`oauth2Auth`):**
        - `type: oauth2`
        - `flows`: Define one or more flows (e.g., `authorizationCode`, `clientCredentials`).
          - `authorizationCode`:
            - `authorizationUrl: https://auth.example.com/oauth/authorize`
            - `tokenUrl: https://auth.example.com/oauth/token`
            - `scopes`: Define available scopes (e.g., `read:profile`, `write:orders`).
    - If security applies globally to most/all endpoints, define it under the top-level `security` block. (Example: `security: - apiKeyAuth: []`).

4.  **Tags for Grouping Operations (`tags` block):**

    - What are the main functional groupings or resource categories for your API endpoints? (Source: `docs/PRD.md` - Key Features/Modules. Examples: "Users", "Products", "Orders").
    - For each tag, provide:
      - `name`: The tag name (e.g., "UserManagement").
      - `description`: A brief explanation of the tag (e.g., "Operations related to user accounts and profiles").

5.  **Reusable Schemas (`components.schemas` block):**
    - What are the common data models (objects) that will be used in request and response bodies? (Source: `docs/PRD.md` - Key Features, Data Models; `docs/TECH_STACK.md` - Database for entities. Examples: `User`, `Product`, `Order`, `ErrorResponse`).
    - For each schema (e.g., `User`):
      - `type: object`
      - `properties`: Define its fields.
        - For each property (e.g., `id`, `username`, `email`, `status`):
          - `type`: (e.g., string, integer, boolean)
          - `format`: (e.g., uuid, email, int64) (Optional)
          - `description`: (A brief explanation of the property) (Optional)
          - `example`: (A sample value) (Optional)

After outputting the full `docs/openapi.yaml` file, give a brief executive summary outlining the main endpoints or components you defined. This summary should not be included inside the YAML file itself.
