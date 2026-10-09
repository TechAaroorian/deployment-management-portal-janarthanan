import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { QueryProvider } from "./QueryProvider";
import App from "../App";
import { data } from "../data/MOCK_DATA";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.history.replaceState(null, "", "#/");
});

it("loads the real API through the application provider and preserves cached status changes", async () => {
  window.history.replaceState(null, "", "#/example3");
  const view = render(<QueryProvider><App /></QueryProvider>);
  expect(await screen.findByText("Loading deployments…", {}, { timeout: 10000 })).toBeInTheDocument();
  const heading = await screen.findByRole("heading", { name: "Customer Portal" }, { timeout: 5000 });
  expect(screen.getByText("Total Deployments:")).toHaveTextContent("10");
  const card = heading.closest('[data-slot="card"]') as HTMLElement;
  await act(async () => {
    fireEvent.click(within(card).getByRole("button", { name: "Advance to In Progress" }));
  });
  await waitFor(() => expect(within(card).getByText("In Progress")).toBeInTheDocument());
  view.unmount();

  await act(async () => { render(<QueryProvider><App /></QueryProvider>); });
  expect(screen.queryByText("Loading deployments…")).not.toBeInTheDocument();
  const restoredCard = screen.getByRole("heading", { name: "Customer Portal" }).closest('[data-slot="card"]') as HTMLElement;
  expect(within(restoredCard).getByText("In Progress")).toBeInTheDocument();
  expect(data[0].status).toBe("Pending");
}, 15000);
