import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "#/");
});

describe("search URL synchronization", () => {
  it("renders a useful empty state for an unmatched search", async () => {
    window.history.replaceState(null, "", "#/example2?search=unknown-app");
    render(<App />);
    expect(await screen.findByText(/No deployments match/, {}, { timeout: 10000 })).toBeInTheDocument();
    expect(screen.getByText("0 of 10 deployments")).toBeInTheDocument();
  }, 15000);

  it("restores search and status from a direct link", async () => {
    window.history.replaceState(null, "", "#/example2?search=customer&status=Pending");
    render(<App />);
    expect(await screen.findByRole("searchbox", { name: "Application name" }, { timeout: 10000 })).toHaveValue("customer");
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue("Pending");
    expect(screen.getByText("1 of 10 deployments")).toBeInTheDocument();
  }, 15000);

  it("updates the URL without adding history entries and removes default filters", async () => {
    window.history.replaceState(null, "", "#/example2");
    const historyLength = window.history.length;
    render(<App />);
    const search = await screen.findByRole("searchbox", { name: "Application name" }, { timeout: 10000 });
    const status = screen.getByRole("combobox", { name: "Status" });
    fireEvent.change(search, { target: { value: "Payments API" } });
    fireEvent.change(status, { target: { value: "In Progress" } });
    const params = new URLSearchParams(window.location.hash.split("?")[1]);
    expect(params.get("search")).toBe("Payments API");
    expect(params.get("status")).toBe("In Progress");
    expect(window.history.length).toBe(historyLength);
    fireEvent.change(search, { target: { value: "" } });
    fireEvent.change(status, { target: { value: "All" } });
    expect(window.location.hash).toBe("#/example2");
  }, 15000);

  it("falls back to All for an invalid URL status", async () => {
    window.history.replaceState(null, "", "#/example2?status=Unknown");
    render(<App />);
    expect(await screen.findByRole("combobox", { name: "Status" }, { timeout: 10000 })).toHaveValue("All");
    expect(screen.getByText("10 of 10 deployments")).toBeInTheDocument();
  }, 15000);

  it("restores filters after hash navigation", async () => {
    window.history.replaceState(null, "", "#/example2?search=customer");
    render(<App />);
    act(() => {
      window.history.replaceState(null, "", "#/example2?search=Payments&status=In+Progress");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(await screen.findByRole("searchbox", { name: "Application name" }, { timeout: 10000 })).toHaveValue("Payments");
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue("In Progress");
    await waitFor(() => expect(screen.getByText("1 of 10 deployments")).toBeInTheDocument());
  }, 15000);
});

describe("exercise navigation and card preview", () => {
  it("advances the preview deployment through both statuses", async () => {
    window.history.replaceState(null, "", "#/example1");
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: "Advance to In Progress" }, { timeout: 10000 }));
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Advance to Completed" }));
    expect(screen.getByRole("button", { name: "Deployment completed" })).toBeDisabled();
  }, 15000);

  it("offers a return-home link for an unknown route", async () => {
    window.history.replaceState(null, "", "#/missing");
    render(<App />);
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return home" })).toHaveAttribute("href", "#/");
  }, 15000);

  it("closes mobile navigation when the brand link is selected", async () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    const brand = screen.getByRole("link", { name: "Deployment Queue" });
    brand.addEventListener("click", (event) => event.preventDefault(), { once: true });
    fireEvent.click(brand);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  }, 15000);
});

describe("mobile navigation", () => {
  it("allows keyboard users to skip navigation and sets a page title", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Skip to content" }));
    expect(screen.getByRole("main")).toHaveFocus();
    expect(document.title).toBe("Home | Deployment Queue");
  }, 15000);

  it("expands mobile filters and preserves values when collapsed", async () => {
    window.history.replaceState(null, "", "#/example2?search=customer&status=Pending");
    render(<App />);
    const toggle = await screen.findByRole("button", { name: /Show filters/ }, { timeout: 10000 });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("searchbox")).toHaveValue("customer");
    expect(screen.getByRole("combobox")).toHaveValue("Pending");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("searchbox")).toHaveValue("customer");
    expect(window.location.hash).toContain("status=Pending");
  }, 15000);

  it("toggles navigation and closes on Escape with focus restored", async () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(screen.getByRole("navigation"), { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  }, 15000);

  it("closes when a navigation link is selected", async () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    const home = within(screen.getByRole("navigation")).getByRole("link", { name: "Home" });
    home.addEventListener("click", (event) => event.preventDefault(), { once: true });
    fireEvent.click(home);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  }, 15000);
});
