import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import DeploymentCard, { type Deployment } from "./example1";

const deployment: Deployment = {
  id: "DEP-1001",
  application: "Customer Portal",
  version: "v4.2.1",
  environment: "Production",
  status: "Pending",
  requestedBy: "John Smith",
  requestedAt: "2026-07-18T09:30:00Z",
  scheduledAt: "2026-07-20T10:00:00Z",
  region: "US-East",
  priority: "High",
};

describe("DeploymentCard", () => {
  it("renders the application name", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("Customer Portal")
    ).toBeInTheDocument();
  });

  it("renders the deployment id", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("DEP-1001")
    ).toBeInTheDocument();
  });

  it("renders the version", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("v4.2.1")
    ).toBeInTheDocument();
  });


  it("renders the deployment status", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("Pending")
    ).toBeInTheDocument();
  });

  it("renders the requested by value", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("John Smith")
    ).toBeInTheDocument();
  });

  it("renders the scheduled date", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("20 Jul 2026, 10:00 UTC")
    ).toHaveAttribute("dateTime", deployment.scheduledAt);
  });

  it("renders the environment, region, priority, and requested date", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(screen.getByText("Production")).toHaveAttribute("data-slot", "badge");
    expect(screen.getByText("Pending")).toHaveAttribute("data-slot", "badge");
    expect(screen.getByText("US-East")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("18 Jul 2026, 09:30 UTC")).toHaveAttribute(
      "dateTime", deployment.requestedAt,
    );
  });

  it.each([
    ["Pending", "In Progress"],
    ["In Progress", "Completed"],
  ] as const)("advances %s to %s without mutating the deployment", (status, nextStatus) => {
    const onAdvance = vi.fn();
    const currentDeployment: Deployment = { ...deployment, status };
    render(<DeploymentCard deployment={currentDeployment} onAdvance={onAdvance} />);

    fireEvent.click(screen.getByRole("button", { name: `Advance to ${nextStatus}` }));

    expect(onAdvance).toHaveBeenCalledExactlyOnceWith(deployment.id, nextStatus);
    expect(currentDeployment.status).toBe(status);
  });

  it("disables the action for completed deployments", () => {
    const onAdvance = vi.fn();
    render(<DeploymentCard deployment={{ ...deployment, status: "Completed" }} onAdvance={onAdvance} />);
    const button = screen.getByRole("button", { name: "Deployment completed" });

    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onAdvance).not.toHaveBeenCalled();
  });

  it("disables the action when no update callback is supplied", () => {
    render(<DeploymentCard deployment={deployment} />);
    expect(screen.getByRole("button", { name: "Advance to In Progress" })).toBeDisabled();
  });

  it.each([
    ["Low", "border-l-stone-400"],
    ["Medium", "border-l-slate-500"],
    ["High", "border-l-amber-700"],
    ["Critical", "border-l-red-800"],
  ] as const)("uses the priority border for %s", (priority, borderClass) => {
    const { container } = render(<DeploymentCard deployment={{ ...deployment, priority }} />);
    expect(container.querySelector('[data-slot="card"]')).toHaveClass("border-l-4", borderClass);
  });

});
