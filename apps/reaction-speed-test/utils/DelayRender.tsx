import { random } from "es-toolkit";
import {
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useState,
} from "react";

interface DelayRenderProps {
  minDelay?: number;
  maxDelay?: number;
  onRender?: (delayTime: number) => void;
  fallback?: ReactNode;
}

export const DelayRender = ({
  children,
  minDelay = 1000,
  maxDelay = 3000,
  onRender,
  fallback = null,
}: PropsWithChildren<DelayRenderProps>) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const delay = random(minDelay, maxDelay);

    const timer = setTimeout(() => {
      setIsVisible(true);
      onRender?.(delay);
    }, delay);

    return () => clearTimeout(timer);
  }, [minDelay, maxDelay, onRender]);

  if (!isVisible) return fallback;

  return children;
};
