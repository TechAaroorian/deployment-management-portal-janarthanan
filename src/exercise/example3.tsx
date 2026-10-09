/**
 * ============================================================================
 * Exercise 3 - Deployment Queue
 * ============================================================================
 *
 * Scenario
 * --------
 *
 * Congratulations!
 *
 * The DeploymentCard component and search functionality have been completed.
 *
 * Your next task is to build the Deployment Queue page by integrating the
 * previous exercises.
 *
 * ============================================================================
 *
 * Requirements
 *
 * Build a Deployment Queue page using the supplied mock API response.
 *
 * The page should display all deployments using the DeploymentCard component
 * created in Exercise 1.
 *
 * Use the custom hook created in Exercise 2 for searching deployments.
 *
 * ============================================================================
 *
 * Functional Requirements
 *
 * 1. Fetch deployments using React Query.
 *
 * 2. Display all deployments.
 *
 * 3. Search deployments by Application Name.
 *
 * 4. Display the following summary:
 *
 *      Total Deployments
 *
 * 5. Add a Status filter.
 *
 *      All
 *      Pending
 *      In Progress
 *      Completed
 *      Failed
 *
 * 6. Display an Empty State when no deployments match the search/filter.
 *
 * 7. Display a Loading State while data is loading.
 *
 * 8. Display an Error State when the request fails.
 *
 * ============================================================================
 *
 * Technical Expectations
 *
 * • React Query
 *
 * • TypeScript
 *
 * • Reusable Components
 *
 * • Clean Folder Structure
 *
 * • Avoid duplicated logic
 *
 * • Use the custom hook from Exercise 2
 *
 * ============================================================================
 *
 * Bonus (Optional)
 *
 * If time permits, implement one or more of the following:
 *
 * • Sort deployments by Scheduled Date
 *
 * • Display deployment counts grouped by Status
 *
 * • Display the number of filtered deployments
 *
 * • Highlight the matched search text
 *
 * ============================================================================
 *
 * Notes
 *
 * • You may create additional components if needed.
 *
 * • You may extend the custom hook created in Exercise 2.
 *
 * • Focus on clean architecture over visual appearance.
 *
 * ============================================================================
 *
 * Evaluation
 *
 * ✓ React
 * ✓ React Query
 * ✓ TypeScript
 * ✓ Component Composition
 * ✓ Hooks
 * ✓ State Management
 * ✓ Code Organization
 * ✓ Reusability
 * ✓ Tailwind CSS
 *
 * ============================================================================
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, LoaderCircle, RefreshCw } from "lucide-react";
import { getDeployments } from "../api/diploymentApi";
import { Button } from "@/components/ui/button";
import DeploymentCard, { type Deployment } from "./example1";
import { DeploymentFilters } from "../components/DeploymentFilters";
import { useDeploymentQueryFilters } from "../hooks/useDeploymentQueryFilters";

const emptyDeployments: Deployment[] = [];

export default function Example3() {
  const queryClient = useQueryClient();
  const { data: deployments = emptyDeployments, isPending, isError, refetch } = useQuery({
    queryKey: ["deployments"],
    queryFn: getDeployments,
  });
  const { search, setSearch, statusFilter, setStatusFilter, filteredDeployments } = useDeploymentQueryFilters(deployments, "#/example3");

  function handleAdvance(id: string, nextStatus: Deployment["status"]) {
    queryClient.setQueryData<Deployment[]>(["deployments"], (current) =>
      current?.map((deployment) => deployment.id === id ? { ...deployment, status: nextStatus } : deployment),
    );
  }

  if (isPending) {
    return (
      <div role="status" className="flex items-center gap-3 rounded-xl border border-border bg-card p-6 text-muted-foreground shadow-sm">
        <LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" />
        Loading deployments…
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="space-y-4 rounded-xl border border-[#a33030]/30 bg-[#fceeee] p-6">
        <p className="flex items-center gap-2 font-medium text-[#a33030]">
          <AlertCircle aria-hidden="true" className="size-5 shrink-0" />
          Unable to load deployments. Please try again.
        </p>
        <Button type="button" variant="outline" onClick={() => void refetch()} className="min-h-11 motion-reduce:transition-none">
          <RefreshCw aria-hidden="true" />Retry
        </Button>
      </div>
    );
  }

  return (
    <section aria-label="Deployment queue" className="space-y-4">
      <DeploymentFilters search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} filteredCount={filteredDeployments.length} totalCount={deployments.length} showTotal />
      {deployments.length === 0 ? (
        <p role="status" className="rounded-xl border border-border bg-card p-6 text-muted-foreground">No deployments are available.</p>
      ) : filteredDeployments.length === 0 ? (
        <p role="status" className="rounded-xl border border-border bg-card p-6 text-muted-foreground">No deployments match your search and status filter. Try another application name or select All statuses.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredDeployments.map((deployment) => <DeploymentCard key={deployment.id} deployment={deployment} onAdvance={handleAdvance} />)}
        </div>
      )}
    </section>
  );
}
