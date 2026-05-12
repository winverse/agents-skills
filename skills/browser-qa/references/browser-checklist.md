# Browser QA Checklist

Use this reference for thorough browser verification. Keep the final answer short; this checklist is for the agent's working pass.

## Evidence To Capture

- URL, route, viewport, and device scale if relevant.
- Intended content contract: what the page, skill guide, or changed route is supposed to show.
- Console errors and warnings.
- Failed network requests, 404s, blocked assets, CORS issues, hydration failures.
- Accessibility snapshot for missing control names, hidden primary content, or unusable interactive elements.
- Screenshots for layout, image, canvas, text overlap, mobile framing, and visual regressions.

## Intent Match

- Do not stop at HTTP `200 OK`, page load, or file reachability.
- Check that visible headings, primary sections, diagrams, labels, and calls to action match the user's requested outcome.
- For `skill.html`, verify that the guide represents the actual skill purpose, trigger, workflow, resources, validation commands, and misuse guardrails.
- Treat stale labels, missing required sections, placeholder copy, or a mismatch between the rendered guide and `SKILL.md` as QA findings.

## Default Viewports

- `1440 x 1000` for desktop app/product UI.
- `1280 x 900` for static guide pages.
- `390 x 844` for mobile web UI when responsive behavior matters.
- Add tablet only when layout has a breakpoint around tablet width.

## Static HTML

- Serve through localhost when direct `file:` navigation is unavailable.
- Check all local `href` links.
- Confirm no external assets are required when the repo expects portable HTML.
- Check that diagrams/SVGs are visible and not clipped.
- Check that the actual visible guide content matches the intended skill behavior; `200 OK` alone is not enough.

## Frontend App

- Confirm the dev server booted successfully.
- Visit the changed route directly and through one normal navigation path.
- Check loading, empty, error, and success states when data makes them available.
- Interact with primary controls using click and keyboard.
- Watch for layout shift when dynamic content, hover, focus, or async data appears.

## Failure Severity

- **Blocker**: page does not load, primary route crashes, destructive action risk, blank canvas, hydration prevents use.
- **Major**: primary workflow broken, key asset missing, text overlap hides content, inaccessible primary controls.
- **Minor**: secondary console warning, small alignment issue, noncritical link or state issue.
- **Note**: observation that may matter but does not block use.
