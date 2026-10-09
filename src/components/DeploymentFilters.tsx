import { ChevronDown, LayoutGrid, Search } from "lucide-react";
import { statusFilterOptions, type StatusFilter } from "../exercise/example2";

interface DeploymentFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
  filteredCount: number;
  totalCount: number;
  showTotal?: boolean;
}

export function DeploymentFilters({ search, setSearch, statusFilter, setStatusFilter, filteredCount, totalCount, showTotal = false }: DeploymentFiltersProps) {
  return (
      <div className="space-y-2 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
      {showTotal && (
        <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
          <LayoutGrid aria-hidden="true" className="size-5 text-primary" />
          <p className="font-medium">Total Deployments: <span className="font-semibold tabular-nums">{totalCount}</span></p>
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="w-full max-w-md space-y-2">
        <label htmlFor="deployment-search" className="block text-sm font-medium">Application name</label>
        <div className="group relative">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-150 group-focus-within:text-primary motion-reduce:transition-none" />
        <input
          id="deployment-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search applications"
          className="min-h-11 w-full rounded-md border border-input bg-background pr-3 pl-10 text-sm outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-out hover:border-primary/50 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/25 motion-reduce:transition-none"
        />
        </div>
      </div>
      <div className="w-full space-y-2 sm:w-48">
        <label htmlFor="deployment-status" className="block text-sm font-medium">Status</label>
        <div className="group relative">
        <select
          id="deployment-status"
          value={statusFilter}
          onChange={(event) => {
            const selected = statusFilterOptions.find((option) => option === event.target.value);
            if (selected) setStatusFilter(selected);
          }}
          className="min-h-11 w-full appearance-none rounded-md border border-input bg-background pr-10 pl-3 text-sm outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-out hover:border-primary/50 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/25 motion-reduce:transition-none"
        >
          {statusFilterOptions.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-150 group-focus-within:text-primary motion-reduce:transition-none" />
        </div>
      </div>
      </div>
        <p className="text-sm text-muted-foreground" role="status">
          {filteredCount} of {totalCount} deployments
        </p>
      </div>
  );
}
