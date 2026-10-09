import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDeploymentFilters } from "./example2";

const deployments = [
  { id: "DEP-1", application: "Customer Portal", requestedBy: "Payments Team" },
  { id: "DEP-2", application: "Payments API", requestedBy: "John Smith" },
  { id: "DEP-3", application: "Customer Analytics", requestedBy: "Emily Davis" },
];

describe("useDeploymentFilters", () => {
  const statusDeployments = [
    { application: "Customer Portal", status: "Pending" },
    { application: "Customer Analytics", status: "Completed" },
    { application: "Payments API", status: "Pending" },
    { application: "Failed Service", status: "Failed" },
    { application: "Billing Service", status: "In Progress" },
  ];

  it.each(["Pending", "In Progress", "Completed", "Failed"] as const)("filters by %s status", (status) => {
    const { result } = renderHook(() => useDeploymentFilters(statusDeployments));
    act(() => result.current.setStatusFilter(status));
    expect(result.current.filteredDeployments).toEqual(statusDeployments.filter((item) => item.status === status));
  });

  it("combines application search with status filtering", () => {
    const { result } = renderHook(() => useDeploymentFilters(statusDeployments));
    act(() => {
      result.current.setSearch("customer");
      result.current.setStatusFilter("Pending");
    });
    expect(result.current.filteredDeployments).toEqual([statusDeployments[0]]);
    act(() => result.current.setStatusFilter("All"));
    expect(result.current.filteredDeployments).toEqual(statusDeployments.slice(0, 2));
    expect(result.current.search).toBe("customer");
  });

  it("returns no matches when search and status do not overlap", () => {
    const { result } = renderHook(() => useDeploymentFilters(statusDeployments));
    act(() => {
      result.current.setSearch("payments");
      result.current.setStatusFilter("Completed");
    });
    expect(result.current.filteredDeployments).toEqual([]);
  });

  it("starts with an empty search and returns all deployments", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));
    expect(result.current.search).toBe("");
    expect(result.current.filteredDeployments).toEqual(deployments);
  });

  it("matches partial application names regardless of case", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));
    act(() => result.current.setSearch("cUsToMeR"));
    expect(result.current.search).toBe("cUsToMeR");
    expect(result.current.filteredDeployments).toEqual([deployments[0], deployments[2]]);
  });

  it("ignores surrounding whitespace", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));
    act(() => result.current.setSearch("  payments  "));
    expect(result.current.filteredDeployments).toEqual([deployments[1]]);
  });

  it("searches only application names", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));
    act(() => result.current.setSearch("John Smith"));
    expect(result.current.filteredDeployments).toEqual([]);
  });

  it("returns an empty list when nothing matches", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));
    act(() => result.current.setSearch("Inventory"));
    expect(result.current.filteredDeployments).toEqual([]);
  });

  it("restores all deployments when the search is cleared", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));
    act(() => result.current.setSearch("Payments"));
    act(() => result.current.setSearch(""));
    expect(result.current.filteredDeployments).toEqual(deployments);
  });

  it("returns all deployments for whitespace-only search", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));
    act(() => result.current.setSearch("   "));
    expect(result.current.filteredDeployments).toEqual(deployments);
  });

  it("handles an empty input array", () => {
    const { result } = renderHook(() => useDeploymentFilters([]));
    act(() => result.current.setSearch("Customer"));
    expect(result.current.filteredDeployments).toEqual([]);
  });

  it("reapplies the current search when deployments change", () => {
    const { result, rerender } = renderHook(
      ({ items }) => useDeploymentFilters(items),
      { initialProps: { items: deployments } },
    );
    act(() => result.current.setSearch("Customer"));
    const added = { id: "DEP-4", application: "Customer Support", requestedBy: "Jane" };
    rerender({ items: [...deployments, added] });
    expect(result.current.filteredDeployments).toEqual([deployments[0], deployments[2], added]);
    expect(result.current.search).toBe("Customer");
  });

  it("preserves the source array, item values, and order", () => {
    const source = Object.freeze(deployments.map((item) => Object.freeze({ ...item })));
    const original = source.map((item) => ({ ...item }));
    const { result } = renderHook(() => useDeploymentFilters(source));
    act(() => result.current.setSearch("Customer"));
    expect(result.current.filteredDeployments).toEqual([source[0], source[2]]);
    expect(source).toEqual(original);
  });
});
