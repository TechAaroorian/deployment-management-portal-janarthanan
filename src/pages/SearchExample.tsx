import { useDeploymentQueryFilters } from "../hooks/useDeploymentQueryFilters";
import { DeploymentFilters } from "../components/DeploymentFilters";
import { DeploymentGrid } from "../components/DeploymentGrid";
import { HelpTooltip } from "../components/HelpTooltip";
import { data } from "../data/MOCK_DATA";

export default function SearchExample() {
  const { search, setSearch, statusFilter, setStatusFilter, filteredDeployments } = useDeploymentQueryFilters(data, "#/example2");

  return (
    <section className="space-y-4" aria-label="Deployment search">
      <DeploymentFilters search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} filteredCount={filteredDeployments.length} totalCount={data.length} />
      <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
        <p>Status actions are disabled in this search demo.</p>
        <HelpTooltip label="Why are status actions disabled?">
          Exercise 2 demonstrates search and filtering. Use Exercise 1 for the interactive card preview or Exercise 3 to advance deployments in the queue.
        </HelpTooltip>
        <a href="#/example3" className="inline-flex min-h-11 items-center rounded-md px-2 font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          Open deployment queue
        </a>
      </div>
      {filteredDeployments.length === 0 ? (
        <p className="py-8 text-muted-foreground">No deployments match your search and status filter. Try another application name or select All statuses.</p>
      ) : (
        <DeploymentGrid deployments={filteredDeployments} />
      )}
    </section>
  );
}

