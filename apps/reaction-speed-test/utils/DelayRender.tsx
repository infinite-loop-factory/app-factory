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
  shouldRestart?: boolean;
  fallback?: ReactNode;
}

export const DelayRender = ({
  children,
  minDelay = 1000,
  maxDelay = 3000,
  onRender,
  shouldRestart = false,
  fallback = null,
}: PropsWithChildren<DelayRenderProps>) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // shouldRestart가 true이거나 초기 렌더링일 때 타이머 시작
    if (!isVisible || shouldRestart) {
      const delay = random(minDelay, maxDelay);
      setIsVisible(false); // 숨김 처리

      const timer = setTimeout(() => {
        setIsVisible(true);
        onRender?.(delay);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [minDelay, maxDelay, onRender, shouldRestart, isVisible]);

  if (!isVisible) return fallback;

  return children;
};
