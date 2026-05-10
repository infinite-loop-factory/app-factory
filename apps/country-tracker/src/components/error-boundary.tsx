import type { ReactNode } from "react";

import { Component } from "react";
// import * as Sentry from "@sentry/react-native";
import { ErrorFallback } from "@/components/error-fallback";

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly _fallback?: ReactNode;
}

interface ErrorBoundaryState {
  readonly error: unknown;
  readonly hasError: boolean;
}

/**
 * ErrorBoundary wrapper using Sentry's official ErrorBoundary component.
 *
 * This provides better integration with Sentry error tracking:
 * - Automatic error reporting to Sentry
 * - Enhanced error context (component stack, tags, etc.)
 * - Follows React Native and Sentry best practices
 *
 * @see https://docs.sentry.io/platforms/react-native/user-guide/react-integration/
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.resetError = this.resetError.bind(this);
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: { componentStack: string }) {
    // Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  resetError() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    const { hasError, error } = this.state;
    const { children, _fallback } = this.props;

    if (hasError) {
      if (_fallback != null) {
        return <>{_fallback}</>;
      }
      return <ErrorFallback error={error} resetError={this.resetError} />;
    }

    return <>{children}</>;
  }
}
