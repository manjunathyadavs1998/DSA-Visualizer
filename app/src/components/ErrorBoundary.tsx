import { Component } from 'react';
import type { ReactNode } from 'react';

interface State {
  error: Error | null;
}

/** Last line of defense: a render crash shows a recoverable message instead of
 *  a blank screen. "Reset & reload" also clears the saved selection in case a
 *  persisted state is what keeps crashing. */
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-ink px-6 font-sans text-t1">
        <div className="max-w-xl border border-pk/40 bg-panel px-6 py-5">
          <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-pk">
            something crashed
          </p>
          <p className="mt-2 font-mono text-[12px] leading-relaxed text-t2">
            {this.state.error.message}
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => location.reload()}
              className="border border-cy/50 bg-cy/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-cy transition-colors hover:bg-cy/20"
            >
              reload
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('rl-sel');
                location.reload();
              }}
              className="border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-t2 transition-colors hover:border-cy/50 hover:text-cy"
            >
              reset selection & reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
