import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ViewToggle } from "./ViewToggle";

describe("ViewToggle", () => {
  it("calls onChange with 'list' when the List button is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ViewToggle view="map" onChange={onChange} />);

    await user.click(screen.getByText(/list/i));
    expect(onChange).toHaveBeenCalledWith("list");
  });

  it("calls onChange with 'map' when the Map button is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ViewToggle view="list" onChange={onChange} />);

    await user.click(screen.getByText(/map/i));
    expect(onChange).toHaveBeenCalledWith("map");
  });
});
