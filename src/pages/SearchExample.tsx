import { useDeploymentQueryFilters } from "../hooks/useDeploymentQueryFilters";
import { DeploymentFilters } from "../components/DeploymentFilters";
import { DeploymentGrid } from "../components/DeploymentGrid";
import { data } from "../data/MOCK_DATA";

export default function SearchExample() {
  const { search, setSearch, statusFilter, setStatusFilter, filteredDeployments } = useDeploymentQueryFilters(data, "#/example2");

  return (
    <section className="space-y-4" aria-label="Deployment search">
      <DeploymentFilters search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} filteredCount={filteredDeployments.length} totalCount={data.length} />
      {filteredDeployments.length === 0 ? (
        <p className="py-8 text-muted-foreground">No deployments match your search and status filter. Try another application name or select All statuses.</p>
      ) : (
        <DeploymentGrid deployments={filteredDeployments} />
      )}
    </section>
  );
}

