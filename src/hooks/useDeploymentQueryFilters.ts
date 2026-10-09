import { useEffect } from "react";
import { statusFilterOptions, useDeploymentFilters } from "../exercise/example2";

export function useDeploymentQueryFilters<T extends { application: string; status?: string }>(
  deployments: readonly T[],
  route: string,
) {
  const params = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
  const initialStatus = statusFilterOptions.find((status) => status === params.get("status")) ?? "All";
  const { search, setSearch, statusFilter, setStatusFilter, filteredDeployments } = useDeploymentFilters(deployments, {
    search: params.get("search") ?? "",
    statusFilter: initialStatus,
  });

  useEffect(() => {
    function restoreFilters() {
      if (window.location.hash.split("?")[0] !== route) return;
      const query = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
      setSearch(query.get("search") ?? "");
      setStatusFilter(statusFilterOptions.find((status) => status === query.get("status")) ?? "All");
    }
    window.addEventListener("hashchange", restoreFilters);
    return () => window.removeEventListener("hashchange", restoreFilters);
  }, [route, setSearch, setStatusFilter]);

  useEffect(() => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (statusFilter !== "All") query.set("status", statusFilter);
    const url = new URL(window.location.href);
    url.hash = `${route}${query.size ? `?${query.toString()}` : ""}`;
    window.history.replaceState(window.history.state, "", url);
  }, [route, search, statusFilter]);

  return { search, setSearch, statusFilter, setStatusFilter, filteredDeployments };
}
