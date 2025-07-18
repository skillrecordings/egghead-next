# Generate Parallel Task Plans

When the user requests "parallel tasks" or "create [number] parallel tasks", you will generate multiple independent task plan documents that can be worked on simultaneously by different developers without file conflicts.

## Process

1. **Analyze Project Structure**

   - Review project documentation in `docs/` directory
   - Identify major architectural boundaries (frontend/backend, features, etc.)
   - Map file ownership to ensure no overlap between tasks

2. **Generate Independent Task Plans**

   - Create 3-5 separate task plan files (based on user request)
   - Each file follows naming: `docs/tasks/<YYYY-MM-DD-HH-MM-parallel-N-task-name>.md`
   - Tasks must operate on completely different file sets
   - Each task should be self-contained and independently verifiable

3. **Task Independence Criteria**
   - No shared file modifications between tasks
   - Different directories/modules when possible
   - Independent test suites
   - Separate feature areas or layers

## Task Plan Template

Each parallel task document must follow this structure:

```markdown
# Task: [Descriptive Task Name]

**Parallel Task Group**: <YYYY-MM-DD-HH-MM>
**Task Number**: [N of Total]
**Estimated Duration**: [time estimate]
**Dependencies**: None (parallel task)

## Objective

[Clear description of what this task accomplishes]

## File Scope

**Files to Modify**:

- [List all files this task will touch]

**Files to Create**:

- [List any new files]

## Verification

- [ ] No conflicts with other parallel tasks
- [ ] Independent test suite passes
- [ ] Can be merged independently

## Commits

### Commit 1: [Semantic Type]: [Description]

**Files**: [list]
**Changes**:

- [Specific changes]

**Verification**:

- [ ] Tests pass
- [ ] No lint errors
- [ ] Feature works in isolation

[Additional commits as needed...]

## Post-Task

- [ ] Update relevant documentation
- [ ] Add integration tests if needed
```

## Example Usage

User: "Create 3 parallel tasks to improve the application"

Assistant creates:

1. `docs/tasks/2024-01-15-14-30-parallel-1-frontend-optimization.md`
2. `docs/tasks/2024-01-15-14-30-parallel-2-backend-performance.md`
3. `docs/tasks/2024-01-15-14-30-parallel-3-test-coverage.md`

## Rules

1. **No Overlapping Files**: Verify file lists across all parallel tasks have zero intersection
2. **Independent Verification**: Each task must have its own verification steps
3. **Clear Boundaries**: Tasks should align with natural architectural boundaries
4. **No Sequential Dependencies**: Tasks must not depend on completion of other parallel tasks
5. **Atomic Commits**: Each task's commits should be independently mergeable

## Output Requirements

1. Create all task files in a single operation
2. Display a summary table showing:
   - Task number and name
   - File count and directories affected
   - Estimated duration
   - Key objectives
3. Verify no file conflicts across all tasks
4. No conversational output beyond the summary table

## Conflict Prevention

Before creating tasks:

1. Build a complete file map of the project
2. Identify natural boundaries (directories, features, layers)
3. Ensure each task operates in its own "zone"
4. Flag any potential integration points for later coordination
