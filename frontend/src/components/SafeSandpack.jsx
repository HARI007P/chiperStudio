import React from "react";

class SafeSandpack extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    if (error.message.includes("ResizeObserver loop completed")) {
      // Don't update state for these errors — ignore them
      return { hasError: false };
    }
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (!error.message.includes("ResizeObserver loop completed")) {
      console.error(error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div style={{ padding: "1rem", color: "red", fontWeight: "bold" }}>
          Something went wrong while displaying this component.
        </div>
      );
    }
    return this.props.children;
  }
}

export default SafeSandpack;
