import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddResourceModal } from "./AddResourceModal";

// The modal embeds a real Leaflet map for pin-picking. We're testing our
// own form/submission logic here, not Leaflet's rendering — jsdom can't
// support real Leaflet DOM measurement anyway, so we stub react-leaflet
// with minimal passthrough components. This is a standard pattern for
// testing around heavy third-party DOM libraries.
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  useMapEvents: () => null,
}));

const mockAddResource = vi.fn();
vi.mock("../lib/resources", () => ({
  addResource: (...args: unknown[]) => mockAddResource(...args),
}));

describe("AddResourceModal", () => {
  const defaultProps = {
    onClose: vi.fn(),
    userLocation: [28.6139, 77.209] as [number, number],
    theme: "light" as const,
  };

  beforeEach(() => {
    localStorage.clear();
    mockAddResource.mockReset();
    mockAddResource.mockResolvedValue(undefined);
  });

  it("disables submit until required fields are filled", async () => {
    render(<AddResourceModal {...defaultProps} />);
    const submitButton = screen.getByRole("button", { name: /add resource/i });
    expect(submitButton).toBeDisabled();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/community health clinic/i), "Test Clinic");
    expect(submitButton).toBeDisabled(); // address still missing

    await user.type(screen.getByPlaceholderText(/street, area, landmark/i), "Test Address");
    expect(submitButton).not.toBeDisabled(); // userLocation already provides a position
  });

  it("submits successfully with valid data and closes the modal", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<AddResourceModal {...defaultProps} onClose={onClose} />);

    await user.type(screen.getByPlaceholderText(/community health clinic/i), "Test Clinic");
    await user.type(screen.getByPlaceholderText(/street, area, landmark/i), "123 Test Road");
    await user.click(screen.getByRole("button", { name: /add resource/i }));

    await waitFor(() => expect(mockAddResource).toHaveBeenCalledTimes(1));
    expect(mockAddResource).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test Clinic",
        address: "123 Test Road",
        category: "health",
        access: "open",
        source: "user",
      })
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("silently no-ops without writing to Firestore when the honeypot is filled", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { container } = render(<AddResourceModal {...defaultProps} onClose={onClose} />);

    await user.type(screen.getByPlaceholderText(/community health clinic/i), "Bot Entry");
    await user.type(screen.getByPlaceholderText(/street, area, landmark/i), "Bot Address");

    // The honeypot field is hidden from sighted users via CSS but present
    // in the DOM — simulate a bot filling every field it finds.
    const honeypot = container.querySelector("#website") as HTMLInputElement;
    expect(honeypot).toBeTruthy();
    await user.type(honeypot, "http://spam.example.com");

    await user.click(screen.getByRole("button", { name: /add resource/i }));

    expect(mockAddResource).not.toHaveBeenCalled();
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("blocks submission and shows an error when the rate limit is exceeded", async () => {
    // Pre-seed localStorage with 5 recent submissions (the configured limit).
    const now = Date.now();
    localStorage.setItem(
      "neighbornet-submissions",
      JSON.stringify([now, now, now, now, now])
    );

    const user = userEvent.setup();
    render(<AddResourceModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText(/community health clinic/i), "Test Clinic");
    await user.type(screen.getByPlaceholderText(/street, area, landmark/i), "Test Address");
    await user.click(screen.getByRole("button", { name: /add resource/i }));

    expect(mockAddResource).not.toHaveBeenCalled();
    expect(
      await screen.findByText(/try again in about/i)
    ).toBeInTheDocument();
  });

  it("shows an error message if the submission fails", async () => {
    mockAddResource.mockRejectedValueOnce(new Error("network error"));
    const user = userEvent.setup();
    render(<AddResourceModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText(/community health clinic/i), "Test Clinic");
    await user.type(screen.getByPlaceholderText(/street, area, landmark/i), "Test Address");
    await user.click(screen.getByRole("button", { name: /add resource/i }));

    expect(await screen.findByText(/couldn't save/i)).toBeInTheDocument();
  });

  it("calls onClose when Escape is pressed", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<AddResourceModal {...defaultProps} onClose={onClose} />);

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("has proper dialog accessibility attributes", () => {
    render(<AddResourceModal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
  });
});
