import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it } from "vitest";
import { HelpTooltip } from "./HelpTooltip";

it("exposes help on keyboard focus and dismisses it with Escape", async () => {
  render(<HelpTooltip label="Why are status actions disabled?">Use the deployment queue to advance statuses.</HelpTooltip>);
  const trigger = screen.getByRole("button", { name: "Why are status actions disabled?" });
  fireEvent.keyDown(document, { key: "Tab" });
  act(() => trigger.focus());
  expect(await screen.findByRole("tooltip")).toHaveTextContent("Use the deployment queue to advance statuses.");
  fireEvent.keyDown(trigger, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  expect(trigger).toHaveFocus();
});
