import { Component, type ErrorInfo, type ReactNode } from "react";
import { EmptyState } from "@/shared/components/EmptyState";

interface AdminErrorBoundaryProps {
  children: ReactNode;
}

interface AdminErrorBoundaryState {
  error: Error | null;
}

export class AdminErrorBoundary extends Component<
  AdminErrorBoundaryProps,
  AdminErrorBoundaryState
> {
  constructor(props: AdminErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): AdminErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Admin error boundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <EmptyState
          title="Algo salió mal"
          description="Ocurrió un error inesperado en la sección de administración."
        />
      );
    }

    return this.props.children;
  }
}
