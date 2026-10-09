import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDeployments } from "../api/diploymentApi";
import { data } from "../data/MOCK_DATA";
import Example3 from "./example3";

vi.mock("../api/diploymentApi", () => ({ getDeployments: vi.fn() }));

function renderQueue() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(<QueryClientProvider client={client}><Example3 /></QueryClientProvider>);
}

beforeEach(() => {
  vi.resetAllMocks();
  window.history.replaceState(null, "", "#/example3");
});

describe("Deployment Queue API integration", () => {
  it("combines debounced search and immediate status filters", async () => {
    vi.mocked(getDeployments).mockResolvedValue(data);
    renderQueue();
    await screen.findByRole("heading", { name: "Customer Portal" });
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "customer" } });
    expect(screen.getByRole("searchbox")).toHaveValue("customer");
    await waitFor(() => expect(screen.getByText("1 of 10 deployments")).toBeInTheDocument());
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Completed" } });
    expect(screen.getByText(/No deployments match/)).toBeInTheDocument();
    expect(screen.getByText("Total Deployments:")).toHaveTextContent("10");
  });

  it("advances status in the query cache without changing mock data", async () => {
    vi.mocked(getDeployments).mockResolvedValue(data);
    renderQueue();
    const heading = await screen.findByRole("heading", { name: "Customer Portal" });
    const card = heading.closest('[data-slot="card"]') as HTMLElement;
    fireEvent.click(within(card).getByRole("button", { name: "Advance to In Progress" }));
    expect(await within(card).findByText("In Progress")).toBeInTheDocument();
    fireEvent.click(within(card).getByRole("button", { name: "Advance to Completed" }));
    expect(await within(card).findByRole("button", { name: "Deployment completed" })).toBeDisabled();
    expect(data[0].status).toBe("Pending");
  });

  it("shows loading while the request is pending", () => {
    vi.mocked(getDeployments).mockReturnValue(new Promise(() => {}));
    renderQueue();
    expect(screen.getByRole("status")).toHaveTextContent("Loading deployments");
  });

  it("renders API deployments and their total", async () => {
    vi.mocked(getDeployments).mockResolvedValue(data);
    renderQueue();
    expect(await screen.findByText("Total Deployments:")).toHaveTextContent("10");
    for (const deployment of data) {
      expect(screen.getByRole("heading", { name: deployment.application })).toBeInTheDocument();
    }
  });

  it("shows an empty state for an empty response", async () => {
    vi.mocked(getDeployments).mockResolvedValue([]);
    renderQueue();
    expect(await screen.findByText("No deployments are available.")).toBeInTheDocument();
    expect(screen.getByText("Total Deployments:")).toHaveTextContent("0");
  });

  it("shows an error and retries successfully", async () => {
    vi.mocked(getDeployments).mockRejectedValueOnce(new Error("API unavailable")).mockResolvedValueOnce(data);
    renderQueue();
    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to load deployments");
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByRole("heading", { name: "Customer Portal" })).toBeInTheDocument();
    await waitFor(() => expect(getDeployments).toHaveBeenCalledTimes(2));
  });
});
