import { Component, type ReactNode } from "react";

/** Last line of defence during a presentation: never leave a blank screen. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="loading" role="alert">
        <div style={{ textAlign: "center" }}>
          <p>Something went wrong ({this.state.error.message}).</p>
          <button className="btn primary" onClick={() => location.reload()}>Reload the map</button>
        </div>
      </div>
    );
  }
}
