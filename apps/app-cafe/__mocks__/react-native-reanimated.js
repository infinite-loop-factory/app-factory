const { Text, View, Image, ScrollView, FlatList } = require("react-native");

const Animated = {
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  createAnimatedComponent: (component) => component,
};

const mock = {
  __esModule: true,
  default: Animated,
  Animated,
  useSharedValue: (init) => ({ value: init }),
  useAnimatedStyle: (fn) => fn(),
  useAnimatedProps: (fn) => fn(),
  withTiming: (value) => value,
  withSpring: (value) => value,
  withDelay: (_delay, value) => value,
  withSequence: (...values) => values[values.length - 1],
  withRepeat: (value) => value,
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  interpolate: (_value, _inputRange, outputRange) => outputRange[0],
  Extrapolation: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
  useAnimatedScrollHandler: () => () => undefined,
  useDerivedValue: (fn) => ({ value: fn() }),
  cancelAnimation: () => undefined,
  Easing: {
    linear: (t) => t,
    ease: (t) => t,
    bezier: () => (t) => t,
    in: (fn) => fn,
    out: (fn) => fn,
    inOut: (fn) => fn,
  },
};

module.exports = mock;
