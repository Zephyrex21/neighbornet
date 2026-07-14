import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

/**
 * Catches render-time errors anywhere in the child tree and shows a
 * recoverable fallback instead of a blank white screen. This only catches
 * errors during render/lifecycle/constructors — it does NOT catch errors
 * inside event handlers (those are handled separately, e.g. the try/catch
 * in AddResourceModal's submit handler) or inside async code, which is a
 * documented React limitation, not an oversight here.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In a real deployment this is where you'd forward to an error monitoring
    // service (Sentry, etc.) — see PRODUCTION.md for the integration point.
    console.error("NeighborNet crashed:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper-50 px-6 text-center dark:bg-ink-950">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertTriangle size={26} />
          </span>
          <div>
            <h1 className="font-display text-xl font-semibold text-ink-950 dark:text-white">
              Something broke
            </h1>
            <p className="mt-1.5 max-w-sm text-sm text-ash-500 dark:text-paper-300/50">
              NeighborNet hit an unexpected error. You can try again, or
              reload the page if that doesn't help.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={this.handleReset}
              className="rounded-lg border border-ink-800/15 px-4 py-2 text-sm font-medium text-ink-800 transition active:scale-95 hover:bg-ink-800/8 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-brand bg-gradient-brand-hover rounded-lg px-4 py-2 text-sm font-medium text-white transition active:scale-95"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
