import { useId, useState } from "react";
import { ChevronDown, LayoutGrid, Search, SlidersHorizontal } from "lucide-react";
import { statusFilterOptions, type StatusFilter } from "../exercise/example2";
import { Button } from "./ui/button";

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
  const [expanded, setExpanded] = useState(false);
  const controlsId = useId();
  const searchId = `${controlsId}-search`;
  const statusId = `${controlsId}-status`;
  const activeFilterCount = Number(Boolean(search.trim())) + Number(statusFilter !== "All");

  return (
      <div className="sticky top-0 z-10 -mx-4 bg-background px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [@media(max-height:500px)]:static">
      <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end lg:flex-nowrap lg:gap-6 lg:px-5">
      <div className={showTotal ? "flex w-full items-center justify-between gap-3 sm:contents" : "flex items-center justify-between gap-3 sm:hidden"}>
      {showTotal ? (
        <div className="flex w-full min-w-0 items-center gap-3 lg:w-auto lg:shrink-0 lg:self-center lg:border-r lg:border-border lg:pr-6">
          <LayoutGrid aria-hidden="true" className="size-7 shrink-0 text-primary" />
          <p className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">Total Deployments: <span className="text-2xl leading-none font-semibold text-foreground tabular-nums">{totalCount}</span></p>
        </div>
      ) : <p className="text-sm font-medium">Search and filters</p>}
      <Button type="button" variant="outline" aria-expanded={expanded} aria-controls={controlsId}
        onClick={() => setExpanded((current) => !current)}
        className="min-h-11 shrink-0 gap-2 rounded-lg border-border text-primary sm:hidden motion-reduce:transition-none">
        <SlidersHorizontal aria-hidden="true" />
        {expanded ? "Hide filters" : "Show filters"}
        {activeFilterCount > 0 && <span className="rounded bg-muted px-1.5 text-xs">{activeFilterCount}</span>}
      </Button>
      </div>
      <div id={controlsId} className={`${expanded ? "contents" : "hidden"} sm:contents`}>
      <div className={`w-full min-w-0 space-y-2 sm:flex-1 lg:max-w-2xl ${expanded ? "duration-150 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1" : ""}`}>
        <label htmlFor={searchId} className="block text-xs font-medium text-muted-foreground">Application name</label>
        <div className="group relative">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-150 group-focus-within:text-primary motion-reduce:transition-none" />
        <input
          id={searchId}
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search applications"
          className="min-h-11 w-full rounded-md border border-[#81788e] bg-card pr-3 pl-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-[border-color,box-shadow] duration-150 ease-out hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary motion-reduce:transition-none"
        />
        </div>
      </div>
      <div className={`w-full space-y-2 sm:w-48 sm:shrink-0 ${expanded ? "duration-150 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1" : ""}`}>
        <label htmlFor={statusId} className="block text-xs font-medium text-muted-foreground">Status</label>
        <div className="group relative">
        <select
          id={statusId}
          value={statusFilter}
          onChange={(event) => {
            const selected = statusFilterOptions.find((option) => option === event.target.value);
            if (selected) setStatusFilter(selected);
          }}
          className="min-h-11 w-full cursor-pointer appearance-none rounded-md border border-[#81788e] bg-card pr-10 pl-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-150 ease-out hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary motion-reduce:transition-none"
        >
          {statusFilterOptions.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-150 group-focus-within:text-primary motion-reduce:transition-none" />
        </div>
      </div>
      </div>
        <p className="self-start rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground tabular-nums sm:mb-1.5 sm:w-auto sm:self-end lg:ml-auto lg:shrink-0" role="status">
          {filteredCount} of {totalCount} deployments
        </p>
      </div>
      </div>
  );
}
