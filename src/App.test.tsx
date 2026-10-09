import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "#/");
});

describe("search URL synchronization", () => {
  it("restores search and status from a direct link", () => {
    window.history.replaceState(null, "", "#/example2?search=customer&status=Pending");
    render(<App />);
    expect(screen.getByRole("searchbox", { name: "Application name" })).toHaveValue("customer");
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue("Pending");
    expect(screen.getByText("1 of 10 deployments")).toBeInTheDocument();
  });

  it("updates the URL without adding history entries and removes default filters", () => {
    window.history.replaceState(null, "", "#/example2");
    const historyLength = window.history.length;
    render(<App />);
    const search = screen.getByRole("searchbox", { name: "Application name" });
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
  });

  it("falls back to All for an invalid URL status", () => {
    window.history.replaceState(null, "", "#/example2?status=Unknown");
    render(<App />);
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue("All");
    expect(screen.getByText("10 of 10 deployments")).toBeInTheDocument();
  });

  it("restores filters after hash navigation", async () => {
    window.history.replaceState(null, "", "#/example2?search=customer");
    render(<App />);
    act(() => {
      window.history.replaceState(null, "", "#/example2?search=Payments&status=In+Progress");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(screen.getByRole("searchbox", { name: "Application name" })).toHaveValue("Payments");
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue("In Progress");
    await waitFor(() => expect(screen.getByText("1 of 10 deployments")).toBeInTheDocument());
  });
});

describe("mobile navigation", () => {
  it("toggles navigation and closes on Escape with focus restored", () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(screen.getByRole("navigation"), { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("closes when a navigation link is selected", () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    fireEvent.click(within(screen.getByRole("navigation")).getByRole("link", { name: "Home" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
