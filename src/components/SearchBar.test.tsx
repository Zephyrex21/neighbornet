import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("displays the current value", () => {
    render(<SearchBar value="clinic" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText(/search by name or area/i)).toHaveValue("clinic");
  });

  it("calls onChange with the new value as the user types", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar value="" onChange={onChange} />);

    await user.type(screen.getByPlaceholderText(/search by name or area/i), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });
});
