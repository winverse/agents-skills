# Code Review Checklist

Use this checklist for broad or high-risk reviews.

## Correctness

- New behavior matches the task and surrounding contracts.
- Error, empty, loading, partial, and boundary cases are handled.
- Async work has cancellation, ordering, retry, and stale-result behavior where needed.
- State transitions cannot leave the UI or data model inconsistent.

## Boundaries

- Modules have one reason to change.
- UI, domain, persistence, transport, configuration, and infrastructure concerns are separated.
- Cross-module imports follow the project's intended direction.
- Shared helpers are genuinely shared, not speculative extraction.

## Tests

- Tests cover changed behavior and likely regressions.
- Test names describe user or domain behavior.
- Fixtures are minimal and local to the behavior.
- Missing test coverage is called out when it would materially reduce risk.

## Maintainability

- Names expose intent.
- Types encode contracts.
- Error handling is explicit.
- Logs and messages help diagnose failures without leaking secrets.
- Complexity is justified by the problem.

## Tool And Security Surfaces

- MCP servers, agent tools, CLI wrappers, browser automation, and external API clients have clear read/write/delete/network authority.
- Tool output, web content, generated files, and user-provided data are treated as untrusted input.
- Prompt injection, SSRF, path traversal, shell injection, and unsafe file writes are considered at tool boundaries.
- Destructive commands, production writes, outbound messages, and account-changing actions require an explicit approval path.
- Secrets, private data, screenshots, logs, traces, and eval fixtures are scrubbed before commit or sharing.

## Review Output

- Findings first.
- File and line where possible.
- Severity reflects user or operational impact.
- Include a concise fix direction, not a full rewrite.
