import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccessFilter } from "./AccessFilter";
import { ACCESS_TYPES } from "../lib/access";

describe("AccessFilter", () => {
  it("renders a button for every access type", () => {
    render(<AccessFilter selected={[...ACCESS_TYPES]} onChange={vi.fn()} />);
    expect(screen.getByText(/open to all/i)).toBeInTheDocument();
    expect(screen.getByText(/insured workers/i)).toBeInTheDocument();
    expect(screen.getByText(/registered members/i)).toBeInTheDocument();
  });

  it("toggles an access type on click", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<AccessFilter selected={["open"]} onChange={onChange} />);

    await user.click(screen.getByText(/insured workers/i));
    expect(onChange).toHaveBeenCalledWith(["open", "insured"]);
  });
});
