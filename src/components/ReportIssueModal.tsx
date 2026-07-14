import { useState } from "react";
import { X } from "lucide-react";
import { submitReport } from "../lib/reports";
import type { Resource } from "../lib/resources";

export function ReportIssueModal({
  resource,
  onClose,
}: {
  resource: Resource;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitReport({
        resourceId: resource.id,
        resourceName: resource.name,
        message: message.trim().slice(0, 500),
      });
      setSubmitted(true);
    } catch (e) {
      setError("Couldn't send your report. Please try again.");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-issue-title"
        className="w-full max-w-md rounded-2xl bg-paper-50 shadow-2xl dark:bg-ink-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink-800/10 px-5 py-4 dark:border-white/10">
          <h2 id="report-issue-title" className="font-display text-lg font-semibold text-ink-950 dark:text-white">
            Report an issue
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ash-500 transition active:scale-95 hover:bg-ink-800/8 hover:text-ink-950 dark:text-paper-300/60 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {submitted ? (
            <p className="text-sm text-ash-600 dark:text-paper-300/70">
              Thanks — your report on <strong>{resource.name}</strong> has
              been sent for review.
            </p>
          ) : (
            <>
              <p className="mb-3 text-sm text-ash-600 dark:text-paper-300/70">
                What's outdated or incorrect about{" "}
                <strong>{resource.name}</strong>?
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                placeholder="e.g. This clinic closed down, the hours are wrong, the address doesn't exist…"
                rows={4}
                autoFocus
                className="w-full rounded-lg border border-ink-800/12 bg-white px-3.5 py-2.5 text-sm text-ink-950 placeholder:text-ash-500 transition focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500/50 dark:border-white/12 dark:bg-ink-800 dark:text-white dark:placeholder:text-paper-300/40"
              />
              <p className="mt-1 text-[0.72rem] text-ash-500 dark:text-paper-300/40">
                {message.length}/500
              </p>
              {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-ink-800/10 px-5 py-4 dark:border-white/10">
          {submitted ? (
            <button
              onClick={onClose}
              className="bg-gradient-brand bg-gradient-brand-hover rounded-lg px-4 py-2 text-sm font-medium text-white transition active:scale-95"
            >
              Done
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-ash-600 transition active:scale-95 hover:bg-ink-800/8 dark:text-paper-300/70 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!message.trim() || submitting}
                className="bg-gradient-brand bg-gradient-brand-hover rounded-lg px-4 py-2 text-sm font-medium text-white transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending…" : "Send report"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
