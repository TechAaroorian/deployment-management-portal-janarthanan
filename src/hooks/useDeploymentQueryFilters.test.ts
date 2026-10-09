import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useDeploymentQueryFilters } from "./useDeploymentQueryFilters";

const deployments = [{ application: "Customer Portal", status: "Pending" }];

function navigate(hash: string) {
  act(() => {
    window.history.replaceState(null, "", hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
}

beforeEach(() => window.history.replaceState(null, "", "#/example2?search=customer&status=Pending"));
afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "#/");
});

describe("URL filter restoration", () => {
  it("restores defaults when navigating to a link without parameters", () => {
    const { result } = renderHook(() => useDeploymentQueryFilters(deployments, "#/example2"));
    navigate("#/example2");
    expect(result.current.search).toBe("");
    expect(result.current.statusFilter).toBe("All");
    expect(window.location.hash).toBe("#/example2");
  });

  it("uses All when a restored status is invalid", () => {
    const { result } = renderHook(() => useDeploymentQueryFilters(deployments, "#/example2"));
    navigate("#/example2?search=customer&status=invalid");
    expect(result.current.search).toBe("customer");
    expect(result.current.statusFilter).toBe("All");
    expect(window.location.hash).toBe("#/example2?search=customer");
  });

  it("does not change filters or rewrite the URL after navigation to another page", () => {
    const { result } = renderHook(() => useDeploymentQueryFilters(deployments, "#/example2"));
    navigate("#/example1");
    expect(result.current.search).toBe("customer");
    expect(result.current.statusFilter).toBe("Pending");
    expect(window.location.hash).toBe("#/example1");
  });
});
