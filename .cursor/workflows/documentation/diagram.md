# Create GitHub-Compatible Mermaid Diagrams

**Your Task: When asked to create a diagram, generate it using Mermaid syntax suitable for rendering directly in GitHub Flavored Markdown. Store the diagram in a new file at `docs/diagrams/<diagram-name>.md`. Adhere strictly to the following rules to ensure compatibility and readability.**

## File Existence Check

Run the following command to see which source documents are available:

```bash
ls . docs
```

Use the output to know which files exist before proceeding.

## I. Preliminary Step: Gather Context for the Diagram

Before generating any diagram, you **MUST** attempt to read and understand the content of the following project documents (if they exist and are relevant to the diagram request):

- `NOTES.md`
- `docs/PRD.md` (Product Requirements Document)
- `docs/TECH_STACK.md`
- `docs/openapi.yaml` (or other API specifications)
- Any other architecture or design documents in `docs/` related to the subject of the diagram.

This context is essential for creating an accurate and meaningful diagram.

## II. Core Diagramming Rules for GitHub Mermaid

1.  **Correct Fenced Code Block:**

    - Always start the Mermaid block with triple backticks and `mermaid`: ` ```mermaid `.
    - Always end the block with triple backticks: ` ``` `.
    - **Example:**
      ````markdown
      ```mermaid
      graph TD
        A[Start] --> B{Decision};
        B -- Yes --> C[Action 1];
        B -- No --> D[Action 2];
      ```
      ````
      ```

      ```

2.  **Use Well-Supported Diagram Types:**
    GitHub generally has good support for these common types:

    - `graph` (Flowcharts - `TD` or `TB` is often best for readability)
    - `sequenceDiagram`
    - `classDiagram`
    - `stateDiagram-v2` (Prefer v2 for better features/rendering)
    - `erDiagram` (Entity Relationship)
    - `pie` (Pie charts)
    - `gantt` (Gantt charts)
    - `mindmap` (Basic indented structure only - **NO ICONS**)
    - _Avoid newer or less common diagram types, as GitHub's Mermaid version may not be the latest._

3.  **General Syntax Best Practices:**

    - **Node IDs:** Use simple alphanumeric IDs (e.g., `node1`, `processA`). Avoid spaces or special characters in IDs.
    - **Node/Actor/State Labels (CRITICAL):** **ALWAYS use double quotes (`"..."`)** for labels, especially if they contain spaces, punctuation, special characters (like hyphens, periods, colons), or Mermaid keywords. This is the most common source of rendering errors.
      - **Correct:** `A["User Input: Text"] --> B["Validate Data (Step 1)"];`
      - **Incorrect (Potential Error):** `A[User Input: Text] --> B[Validate Data (Step 1)];`
    - **Arrows:** Use standard arrow types (`-->`, `---`, `==>`, `->>`, etc.).
    - **Comments:** Use `%%` for comments within the Mermaid code if needed (e.g., `%% This is a comment %%`).

4.  **`mindmap` Specifics for GitHub:**

    - GitHub **supports the basic `mindmap` structure** using indentation (spaces or tabs) to define hierarchy.
    - Each node/item **MUST** be on its own line with correct indentation relative to its parent.
    - GitHub **DOES NOT support** advanced `mindmap` features like `::icon()` syntax. Using icons **WILL CAUSE RENDERING ERRORS**.
    - Stick to plain text nodes for mind maps.
    - **Correct `mindmap` (GitHub Compatible):**
      ```mermaid
      mindmap
        Root
          Parent Node
            Child Item 1
            Child Item 2
      ```
    - **Incorrect `mindmap` (GitHub Incompatible - Uses Icons):**
      ```mermaid
      mindmap
        Root
          ::icon(fa fa-star) Parent Node
            ::icon(fa fa-one) Child Item 1
      ```

5.  **Layout Preference for Flowcharts (`graph`):**

    - For `graph` diagrams, prefer `TD` (Top Down) or `TB` (Top Bottom) for better readability within Markdown document flow. Example: `graph TD;`.

6.  **Styling: Let GitHub Handle It (CRITICAL):**

    - **DO NOT** attempt to set themes (e.g., `%%{init: {'theme': 'dark'}}%%`).
    - **DO NOT** try to apply custom styling using `classDef`, `style`, or inline CSS attributes _within the Mermaid code_.
    - GitHub **ignores** these directives and applies its own styling based on the user's current GitHub theme (light, dark, or dimmed). Your diagram will adapt automatically. Forcing themes or styles will likely be ignored or look inconsistent.

7.  **Keep Diagrams Focused and Manageable:**

    - Avoid overly complex diagrams with an excessive number of nodes, edges, or deep nesting in a single block. While GitHub can render complex diagrams, they might become hard to read or hit rendering performance limits.
    - If a concept is very complex, consider breaking it down into multiple, simpler, linked diagrams.

8.  **Verification (If Possible):**

    - If you have access to a GitHub Markdown preview environment, use it to test your Mermaid syntax. This is the best way to catch errors.

9.  **Note on Automated Edits:**
    - Be aware that automated code editing tools may sometimes struggle with precise changes within Mermaid blocks, especially with syntax sensitive to indentation (like mindmaps) or quoting.
    - **Always carefully review any automated edits** made to Mermaid blocks. If errors occur or the diagram doesn't render as expected, manual correction might be required.

## III. Output File

- Place the generated Mermaid diagram (within its fenced code block) into a new Markdown file.
- Save the file to `docs/diagrams/<diagram-name>.md`, where `<diagram-name>` is a descriptive name for the diagram (e.g., `user-authentication-flow.md`, `database-schema.md`).

**REMEMBER: Your goal is to create a clear, accurate Mermaid diagram in `docs/diagrams/<diagram-name>.md` that renders correctly on GitHub. Key success factors are: using ` ```mermaid `, quoting all labels meticulously (`"Like This!"`), avoiding themes/custom styles, and for mindmaps, using only basic indentation (NO icons). Always gather context from project docs first.**
