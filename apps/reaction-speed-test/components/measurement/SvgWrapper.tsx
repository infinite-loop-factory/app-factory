import type { FC, PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";
import Svg from "react-native-svg";

interface FigmaSvgProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

const SvgWrapper: FC<PropsWithChildren<FigmaSvgProps>> = ({
  width = 409 * 0.3,
  height = 422 * 0.3,
  style,
  children,
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 409 422"
      fill="none"
      style={style}
    >
      {children}
    </Svg>
  );
};

export default SvgWrapper;
