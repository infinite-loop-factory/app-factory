import type { ReactNode } from "react";

import * as Sentry from "@sentry/react-native";
import { ErrorFallback } from "@/components/error-fallback";

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

function createFallbackComponent(fallback: ReactNode | undefined) {
  if (fallback) {
    return () => <>{fallback}</>;
  }
  return ErrorFallback;
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
export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <Sentry.ErrorBoundary
      beforeCapture={(scope) => {
        scope.setTag("error_boundary", "root");
      }}
      fallback={createFallbackComponent(fallback)}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
