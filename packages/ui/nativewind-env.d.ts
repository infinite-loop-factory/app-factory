// ! <reference types="nativewind/types" /> 를 인식하지 않아 내부 타입 확장 직접 선언
import type {
  ScrollViewProps,
  ScrollViewPropsAndroid,
  ScrollViewPropsIOS,
  Touchable,
  VirtualizedListProps,
} from "react-native";

declare module "@react-native/virtualized-lists" {
  export interface VirtualizedListWithoutRenderItemProps
    extends ScrollViewProps {
    ListFooterComponentClassName?: string;
    ListHeaderComponentClassName?: string;
  }
}

declare module "react-native" {
  interface ScrollViewProps
    extends ViewProps,
      ScrollViewPropsIOS,
      ScrollViewPropsAndroid,
      Touchable {
    contentContainerClassName?: string;
    indicatorClassName?: string;
  }
  interface FlatListProps<ItemT> extends VirtualizedListProps<ItemT> {
    columnWrapperClassName?: string;
  }
  interface ImageBackgroundProps extends ImagePropsBase {
    imageClassName?: string;
  }
  interface ImagePropsBase {
    className?: string;
    cssInterop?: boolean;
  }
  interface ViewProps {
    className?: string;
    cssInterop?: boolean;
  }
  interface TextInputProps {
    placeholderClassName?: string;
  }
  interface TextProps {
    className?: string;
    cssInterop?: boolean;
  }
  interface SwitchProps {
    className?: string;
    cssInterop?: boolean;
  }
  interface InputAccessoryViewProps {
    className?: string;
    cssInterop?: boolean;
  }
  interface TouchableWithoutFeedbackProps {
    className?: string;
    cssInterop?: boolean;
  }
  interface StatusBarProps {
    className?: string;
    cssInterop?: boolean;
  }
  interface KeyboardAvoidingViewProps extends ViewProps {
    contentContainerClassName?: string;
  }
  interface ModalBaseProps {
    presentationClassName?: string;
  }
}
