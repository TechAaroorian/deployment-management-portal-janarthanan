# Practices and conventions

This document explains the choices used in the assessment solution and where to find them in the code.

## Component composition and reuse

- [DeploymentCard](../src/exercise/example1.tsx) receives a deployment and an optional `onAdvance` callback. It displays the record without owning API or filtering logic. Actions are disabled when no callback is supplied or the deployment is completed.
- [DeploymentGrid](../src/components/DeploymentGrid.tsx) shares the responsive layout between the search demonstration and the full queue. Records use their deployment IDs as React keys.
- [DeploymentFilters](../src/components/DeploymentFilters.tsx) receives controlled values, callbacks, and counts. It owns only the mobile expand/collapse state. `useId` provides unique control IDs and label associations for each instance.
- [The filter hook](../src/exercise/example2.tsx) handles application-name and status filtering. [The URL hook](../src/hooks/useDeploymentQueryFilters.ts) adds URL restoration and synchronization without duplicating filtering logic.

## TypeScript and naming

Components and interfaces use PascalCase; hooks start with `use`; local variables and handlers use camelCase. Props interfaces describe component inputs, and callbacks use names such as `onAdvance` while implementations use `handleAdvance`.

The `Deployment` interface follows the supplied exercise contract. Environment, status, and priority use literal unions. Status transitions and presentation classes use typed lookup maps. Imports used only for types are marked with `type`.

The filter hook accepts a readonly array and a generic record shape, so it can filter compatible records without changing the source data. URL and select status values are checked against the allowed options before use.

The supplied exercise filenames and the API filename `diploymentApi.ts` are retained so the solution is easy to compare with the starter project.

## React state and effects

Input values update immediately through controlled fields. Filtered results are derived with `useMemo`, rather than stored as a second list that must be kept in sync. Search filtering waits 300 ms; the debounce effect clears its timer on changes and unmounting. This delay is optional for ten local records and demonstrates timer cleanup.

Status changes create new records and arrays. The preview uses a functional state update, and the queue uses a functional React Query cache update. Neither mutates the supplied fixtures.

Hash navigation uses `useSyncExternalStore` to subscribe to browser state. Event listeners are removed during cleanup. Filter changes use `history.replaceState` to avoid adding a history entry for every keystroke; shareable links restore search and status.

## Code splitting and data ownership

[App](../src/App.tsx) declares `React.lazy` imports at module scope for each exercise page. A `Suspense` fallback announces page loading while Vite loads the required chunks. Page components live in [src/pages](../src/pages); the integrated queue remains in exercise 3 as requested.

[Exercise 3](../src/exercise/example3.tsx) uses React Query for loading, errors, retry, and cached deployment data. A shared query-key constant within that module keeps fetching and cache updates aligned. [QueryProvider](../src/providers/QueryProvider.tsx) creates its client outside rendering and sets a five-minute stale time.

The supplied API simulates a request with a one-second timer. Search and status filtering run locally after data is available. Status changes update the cache only; they survive navigation while cached, but do not persist after a full reload or API refetch.

## Tailwind and responsive design

All added styling uses Tailwind utilities. The existing starter stylesheet remains; no custom stylesheet or Aar Loom package import was added. Aar Loom influenced the restrained colors, spacing, and interaction feedback.

Complete class names are written in source, including the classes in priority and status maps. The grid adapts to viewport breakpoints, while card details use a container query to adapt to the card's own width. Flexible layouts, `min-w-0`, wrapping, and word wrapping accommodate narrow screens and long values.

Navigation collapses on mobile. Filter controls can expand on mobile, and the toolbar remains sticky while browsing the queue. In short windows, the toolbar scrolls normally to leave room for results.

Transitions target color, shadow, or transform where practical. Animations and press feedback respect reduced-motion preferences through `motion-safe` and `motion-reduce` utilities.

## Accessibility and feedback

The application uses labeled native inputs and selects, semantic headings, description lists for deployment details, and `time` elements with explicit UTC display. Decorative icons are hidden from assistive technology.

Navigation identifies the current page. Mobile controls expose their expanded state and controlled region; Escape closes the navigation and restores focus. A skip control focuses the main content. Focus indicators and minimum control heights support keyboard and touch interaction.

Shared help tooltips explain disabled demonstration actions, status filtering, and temporary status changes. Essential limitations remain visible as text. Tooltip triggers can receive keyboard focus, and Escape dismisses the tooltip. These use the existing Base UI dependency and Tailwind styling.

Loading states and result counts use status announcements, and request errors use an alert with a retry action. Status and priority remain readable as text alongside their colors.

These measures have been reviewed in code and tests. A complete browser, zoom/reflow, and screen-reader audit is still required before claiming WCAG conformance.

## Tests, coverage, and CI

Tests cover card rendering and transitions, combined filtering, debounce behavior, URL restoration, mobile interactions, API timing, queue feedback states, and query-provider cache integration. Assertions focus on rendered behavior and user interactions.

[Coverage configuration](../vite.config.ts) sets minimums of 95% for statements, functions, and lines, and 90% for branches. Tests, static fixtures, supplied UI primitives/utilities, and application bootstrap code are excluded. Coverage percentages are generated by each run rather than maintained manually in this document.

[GitHub Actions](../.github/workflows/ci.yml) runs coverage tests, ESLint, and the TypeScript/Vite production build. It publishes a coverage summary and downloadable coverage/build artifacts. Generated reports and build output are ignored by Git. The workflow verifies the application; website deployment is not configured.

## Assessment boundaries

The required Shadcn components and priority-colored left border are preserved. The deployment contract has three statuses; the required Failed filter is available, but returns no records with the supplied dataset. No backend mutation endpoint or failure transition is assumed.

See [the original assignment](ASSESSMENT.md) for the supplied requirements and [the README](../README.md) for setup and verification commands.
