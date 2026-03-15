import { ErrorBoundary } from "@/components/error-boundary";
import HomeScreen from "@/features/home/components/home-screen";

export default function HomeContainer() {
  return (
    <ErrorBoundary>
      <HomeScreen />
    </ErrorBoundary>
  );
}
