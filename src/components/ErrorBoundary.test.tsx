import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "./ErrorBoundary";

function ThrowsError(): never {
  throw new Error("Test crash");
}

function Safe() {
  return <div>Everything is fine</div>;
}

describe("ErrorBoundary", () => {
  // Suppress React's expected error-boundary console noise for this suite.
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  it("renders children normally when there is no error", () => {
    render(
      <ErrorBoundary>
        <Safe />
      </ErrorBoundary>
    );
    expect(screen.getByText("Everything is fine")).toBeInTheDocument();
  });

  it("shows a fallback UI instead of crashing when a child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowsError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/something broke/i)).toBeInTheDocument();
  });

  it("recovers and re-renders children after clicking Try again", async () => {
    let shouldThrow = true;
    function MaybeThrows() {
      if (shouldThrow) throw new Error("Test crash");
      return <div>Recovered</div>;
    }

    const user = userEvent.setup();
    render(
      <ErrorBoundary>
        <MaybeThrows />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something broke/i)).toBeInTheDocument();
    shouldThrow = false;
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(screen.getByText("Recovered")).toBeInTheDocument();
  });
});
