# Deployment Management Portal

[![CI](https://github.com/TechAaroorian/deployment-management-portal-janarthanan/actions/workflows/ci.yml/badge.svg)](https://github.com/TechAaroorian/deployment-management-portal-janarthanan/actions/workflows/ci.yml)

Wipro React assessment solution by Janarthanan. An internal deployment queue for release engineers, built from the [supplied starter repository](https://github.com/srinivas321123/L1-interview_starter_files). The original assignment README is preserved in [docs/ASSESSMENT.md](docs/ASSESSMENT.md).

## Run locally

Use Node.js 24 (the version used by CI).

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. The home page links to each exercise:

- `#/example1`: reusable deployment card with status progression.
- `#/example2`: application search and status-filter demonstration.
- `#/example3`: full queue using the supplied mock API and React Query.

Example shareable URL: `#/example3?search=customer&status=Pending`.

## Features

- Typed deployment cards with environment/status badges and distinct priority-colored left borders.
- Status progression: Pending -> In Progress -> Completed.
- Case-insensitive application search with a 300 ms debounce and timer cleanup. Input and URL updates remain immediate.
- Combined status filtering, total count, filtered count, and loading/error/empty states with retry.
- URL filter restoration on refresh and hash navigation.
- Responsive card grids, mobile navigation, expandable mobile filters, and a sticky filter toolbar. The toolbar scrolls normally in short windows.
- Tailwind-only styling with Lucide icons and Aar Loom-inspired colors; no Aar Loom dependency or custom stylesheet added.
- Labeled controls, keyboard navigation, skip-to-content, status announcements, visible focus indicators, and reduced-motion support.

## Architecture and assumptions

See [Practices and conventions](docs/PRACTICES.md) for the component boundaries, React and TypeScript patterns, code splitting, Tailwind conventions, accessibility measures, and testing choices used in this solution.

`src/exercise/example1.tsx` exports the reusable card and deployment interface. `example2.tsx` contains the filter hook. `example3.tsx` combines React Query data with the shared controls in `src/components/DeploymentFilters.tsx` and URL synchronization in `src/hooks/useDeploymentQueryFilters.ts`. Search and queue pages reuse `src/components/DeploymentGrid.tsx` for the responsive card layout. Exercise pages load on demand through module-level `React.lazy` imports with a `Suspense` loading state; Vite creates the page and shared component chunks automatically. The card and search demonstrations live in `src/pages/`.

The supplied `getDeployments()` simulates a one-second API request and returns the mock data; it does not make an HTTP request. Filtering runs locally after fetching. Status actions update the React Query cache without changing the source fixtures. Changes survive navigation while cached, but do not persist after a full reload or API refetch.

Exercise 1 requires three deployment statuses; exercise 3 also specifies a Failed filter. The filter supports Failed, which currently returns an empty result because no supplied record has that status. No failure transition or backend mutation endpoint is invented.

Dates display explicitly in UTC. Debouncing is optional for this small dataset and is included to demonstrate delayed filtering with cleanup. Exercise 2 is a filtering demonstration, so its card status actions are disabled; exercise 1 and exercise 3 support actions.

Accessibility has been reviewed in code and tests, including text contrast and control boundaries. A full browser, zoom/reflow, and screen-reader audit has not been completed; this repository does not claim WCAG conformance.

## Checks and coverage

```sh
npm run test          # watch mode
npm run test:run      # single run
npm run test:coverage # single run with V8 coverage
npm run lint
npm run build
npm run preview
```

Open `coverage/index.html` for the local report. Coverage measures application components, hooks, API, and query provider. Tests, static fixtures, supplied UI primitives/utilities, and the application bootstrap are excluded. Thresholds are 95% for statements/functions/lines and 90% for branches.

## GitHub Actions

Pushes and pull requests targeting `main`, and manual runs, execute tests with coverage, lint, and the TypeScript/Vite production build. The run summary displays coverage percentages. Download `coverage-report` for HTML, JSON summary, LCOV, and Cobertura reports; `production-build` contains the Vite build. Artifacts are retained for 14 days. Reports and build output are not committed.

The workflow verifies the application and produces artifacts. Website deployment is not configured.
