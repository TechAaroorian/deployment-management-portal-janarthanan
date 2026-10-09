import { afterEach, expect, it, vi } from "vitest";
import { getDeployments } from "./diploymentApi";
import { data } from "../data/MOCK_DATA";

afterEach(() => vi.useRealTimers());

it("returns the supplied deployments after the simulated network delay", async () => {
  vi.useFakeTimers();
  let resolved = false;
  const response = getDeployments().then((result) => {
    resolved = true;
    return result;
  });
  await vi.advanceTimersByTimeAsync(999);
  expect(resolved).toBe(false);
  await vi.advanceTimersByTimeAsync(1);
  expect(await response).toEqual(data);
  expect(resolved).toBe(true);
});
