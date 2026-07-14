import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryFilter } from "./CategoryFilter";
import { CATEGORIES } from "../lib/categories";

describe("CategoryFilter", () => {
  it("renders a button for every category", () => {
    render(<CategoryFilter selected={[...CATEGORIES]} onChange={vi.fn()} />);
    for (const category of CATEGORIES) {
      expect(screen.getByText(new RegExp(category, "i"))).toBeInTheDocument();
    }
  });

  it("adds a category to the selection when an unselected chip is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<CategoryFilter selected={["food"]} onChange={onChange} />);

    await user.click(screen.getByText(/health/i));
    expect(onChange).toHaveBeenCalledWith(["food", "health"]);
  });

  it("removes a category from the selection when a selected chip is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<CategoryFilter selected={["food", "health"]} onChange={onChange} />);

    await user.click(screen.getByText(/food/i));
    expect(onChange).toHaveBeenCalledWith(["health"]);
  });
});
