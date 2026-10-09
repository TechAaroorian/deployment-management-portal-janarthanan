/**
 * ============================================================================
 * Exercise 2 - useDeploymentFilters
 * ============================================================================
 *
 * Scenario
 * --------
 *
 * The Release Engineering team would like to make the Deployment Queue easier
 * to navigate as the number of deployments continues to grow.
 *
 * Your task is to implement a reusable custom hook that manages searching
 * and filtering deployment data.
 *
 * ============================================================================
 *
 * Create a custom hook named:
 *
 *      useDeploymentFilters
 *
 * ============================================================================
 *
 * The hook should accept an array of deployments.
 *
 * Example
 *
 * const {
 *   search,
 *   setSearch,
 *   filteredDeployments
 * } = useDeploymentFilters(deployments);
 *
 * ============================================================================
 *
 * Functional Requirements
 *
 * The hook should:
 *
 * ✓ Maintain the search text
 *
 * ✓ Return a filtered list of deployments
 *
 * ✓ Filter by Application Name
 *
 * ✓ Filtering should be case-insensitive
 *
 * ============================================================================
 *
 * Technical Expectations
 *
 * • Use React Hooks
 *
 * • Use TypeScript
 *
 * • Keep the hook reusable
 *
 *
 * • Prefer performant solutions where appropriate
 *
 * ============================================================================
 *
 * Notes
 *
 * • Do not modify the supplied deployment data.
 *
 * • This hook will be reused in the next exercise.
 *
 * • Additional filtering requirements may be introduced later.
 *
 * ============================================================================
 *
 * Evaluation
 *
 * ✓ Custom Hooks
 * ✓ TypeScript
 * ✓ React Fundamentals
 * ✓ Code Quality
 * ✓ Reusability
 * ✓ Performance
 *
 * ============================================================================
 */
import { useMemo, useState } from "react";

export const statusFilterOptions = ["All", "Pending", "In Progress", "Completed", "Failed"] as const;
export type StatusFilter = (typeof statusFilterOptions)[number];

export function useDeploymentFilters<T extends { application: string; status?: string }>(
  deployments: readonly T[],
  initialFilters: { search?: string; statusFilter?: StatusFilter } = {},
) {
  const [search, setSearch] = useState(initialFilters.search ?? "");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialFilters.statusFilter ?? "All");

  const filteredDeployments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return deployments.filter((deployment) =>
      deployment.application.toLowerCase().includes(query) &&
      (statusFilter === "All" || deployment.status === statusFilter),
    );
  }, [deployments, search, statusFilter]);

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredDeployments,
  };
}
