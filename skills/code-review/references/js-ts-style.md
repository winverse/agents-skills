# JavaScript And TypeScript Review Preferences

Use these preferences when reviewing JS and TS code. They are preferences, not dogma.

## Functional Collection Style

Prefer functional collection transforms when they make the data flow more direct:

- `map` for one-to-one transformation.
- `filter` for selection.
- `flatMap` for transform plus flatten.
- `reduce` for accumulation when the accumulator has a clear name and shape.
- `some`, `every`, `find`, `findIndex` for predicates.
- `Object.entries`, `Object.fromEntries`, `Map`, `Set`, generators, and `Iterable` helpers for structured iteration.

Call out repetitive `if` plus `for` code when it is only transforming, filtering, grouping, or aggregating data and a functional expression would be shorter and clearer.

## When Loops Are Better

Do not force functional style when a loop is clearer:

- Multiple early exits or guard-driven branching.
- Sequential async operations.
- Performance-sensitive hot paths.
- Mutation against an existing API.
- Complex state machines or parsers.
- Code where `reduce` would hide intent.

## TypeScript Bar

- Avoid `any` unless the boundary is explicitly unknown and narrowed soon after.
- Prefer discriminated unions for variant state.
- Keep runtime validation at external boundaries.
- Do not use type assertions to bypass real uncertainty.
- Public functions should have readable input and output contracts.

## Responsibility Bar

- A function should do one job at one level of abstraction.
- Composition is better than flag-heavy functions.
- Side effects should be visible from the function name or boundary.
- Framework glue should call domain logic, not contain it.
