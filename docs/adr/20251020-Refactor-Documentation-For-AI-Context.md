# ADR: Refactor Documentation for AI Assistant Context

**Date:** 2025-10-20

**Status:** Accepted

## Context

The project utilizes an AI programming assistant (Gemini CLI) for development. To ensure the AI performs effectively, it requires clear, structured information about the project's rules, architecture, and domain knowledge. The initial documentation was scattered across multiple files in the `docs/` directory, making it difficult for the AI to consistently access and synthesize the correct information.

## Decision

We have decided to restructure the project's documentation to align with the best practices for configuring AI assistants, specifically following the conventions used by tools like Cursor. This involves creating a `.cursor` directory in the project root to house AI-specific rules and context.

The new structure is as follows:

-   **`.cursor/rules.mdc`**: This file contains all explicit rules, instructions, and workflows the AI must follow when working on this project. It is a consolidation of previous files like `AGENT_INSTRUCTIONS.md` and `DEPARTMENT_BRIEF_WORKFLOW.md`.

-   **`.cursor/context.mdc`**: This file serves as the main entry point for the AI to understand the project. It contains high-level architectural overviews, technical summaries, and, crucially, **references** to other important documentation files (like the detailed department workshop results in `docs/departments/`) rather than duplicating their content.

-   **`docs/`**: This directory will continue to hold detailed, human-readable documentation. The AI will be directed to read these files for context as needed, but they will not be part of its core, ever-present context file.

## Consequences

**Positive:**

-   **Improved AI Performance:** By providing a clear, centralized set of rules and a high-level context file, the AI can reason more accurately about the project.
-   **Reduced Context Duplication:** Referencing documents instead of duplicating them in `context.mdc` makes maintenance easier. Changes to department documentation only need to be made in one place.
-   **Alignment with Best Practices:** This structure follows established patterns for effective AI context management.

**Negative:**

-   There is a slight overhead in maintaining the `.cursor` directory, but the expected performance gains outweigh this.
