# Component Mapping Reference

This reference provides the complete mapping from React Native primitives to Gluestack UI v3 equivalents.

## Core Layout Components

| React Native           | Gluestack                      | Import Path                              |
| ---------------------- | ------------------------------ | ---------------------------------------- |
| `View`                 | `Box`                          | `@/components/ui/box`                    |
| `ScrollView`           | `ScrollView`                   | `@/components/ui/scroll-view`            |
| `SafeAreaView`         | Use `useSafeAreaInsets()` hook | `react-native-safe-area-context`         |
| `KeyboardAvoidingView` | `KeyboardAvoidingView`         | `@/components/ui/keyboard-avoiding-view` |

## Text Components

| React Native     | Gluestack | Import Path               |
| ---------------- | --------- | ------------------------- |
| `Text`           | `Text`    | `@/components/ui/text`    |
| `Text` (heading) | `Heading` | `@/components/ui/heading` |

## Interactive Components

| React Native               | Gluestack               | Import Path                 |
| -------------------------- | ----------------------- | --------------------------- |
| `TouchableOpacity`         | `Pressable`             | `@/components/ui/pressable` |
| `TouchableHighlight`       | `Pressable`             | `@/components/ui/pressable` |
| `TouchableWithoutFeedback` | `Pressable`             | `@/components/ui/pressable` |
| `Button`                   | `Button` + `ButtonText` | `@/components/ui/button`    |
| `Switch`                   | `Switch`                | `@/components/ui/switch`    |

## Form Components

| React Native            | Gluestack                    | Import Path                |
| ----------------------- | ---------------------------- | -------------------------- |
| `TextInput`             | `Input` + `InputField`       | `@/components/ui/input`    |
| `TextInput` (multiline) | `Textarea` + `TextareaInput` | `@/components/ui/textarea` |
| N/A                     | `Select`                     | `@/components/ui/select`   |
| N/A                     | `Checkbox`                   | `@/components/ui/checkbox` |
| N/A                     | `Radio`                      | `@/components/ui/radio`    |
| N/A                     | `Slider`                     | `@/components/ui/slider`   |

## Media Components

| React Native | Gluestack | Import Path              |
| ------------ | --------- | ------------------------ |
| `Image`      | `Image`   | `@/components/ui/image`  |
| N/A          | `Avatar`  | `@/components/ui/avatar` |
| N/A          | `Icon`    | `@/components/ui/icon`   |

## List Components

| React Native      | Recommended               | Import Path           |
| ----------------- | ------------------------- | --------------------- |
| `FlatList`        | `FlashList`               | `@shopify/flash-list` |
| `SectionList`     | `FlashList` with sections | `@shopify/flash-list` |
| `VirtualizedList` | `FlashList`               | `@shopify/flash-list` |

## Feedback Components

| React Native        | Gluestack     | Import Path                    |
| ------------------- | ------------- | ------------------------------ |
| `ActivityIndicator` | `Spinner`     | `@/components/ui/spinner`      |
| `Modal`             | `Modal`       | `@/components/ui/modal`        |
| `Alert.alert()`     | `AlertDialog` | `@/components/ui/alert-dialog` |
| N/A                 | `Toast`       | `@/components/ui/toast`        |
| N/A                 | `Progress`    | `@/components/ui/progress`     |

## Navigation Components

| React Native | Gluestack     | Import Path                   |
| ------------ | ------------- | ----------------------------- |
| N/A          | `Menu`        | `@/components/ui/menu`        |
| N/A          | `Actionsheet` | `@/components/ui/actionsheet` |
| N/A          | `Popover`     | `@/components/ui/popover`     |
| N/A          | `Tooltip`     | `@/components/ui/tooltip`     |

## Overlay Components

| React Native | Gluestack  | Import Path                |
| ------------ | ---------- | -------------------------- |
| `Modal`      | `Modal`    | `@/components/ui/modal`    |
| N/A          | `Drawer`   | `@/components/ui/drawer`   |
| N/A          | `Backdrop` | Part of overlay components |

## Display Components

| React Native | Gluestack   | Import Path                 |
| ------------ | ----------- | --------------------------- |
| N/A          | `Badge`     | `@/components/ui/badge`     |
| N/A          | `Card`      | `@/components/ui/card`      |
| N/A          | `Divider`   | `@/components/ui/divider`   |
| N/A          | `Accordion` | `@/components/ui/accordion` |

## Gluestack Sub-Component Patterns

### Button

```tsx
import { Button, ButtonText, ButtonIcon, ButtonSpinner } from "@/components/ui/button";

<Button action="primary" size="md" variant="solid">
  <ButtonText>Submit</ButtonText>
</Button>

<Button action="secondary" isDisabled>
  <ButtonSpinner />
  <ButtonText>Loading...</ButtonText>
</Button>

<Button>
  <ButtonText>Next</ButtonText>
  <ButtonIcon as={ChevronRightIcon} />
</Button>
```

### Input

```tsx
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";

<Input variant="outline" size="md">
  <InputField placeholder="Enter email" />
</Input>

<Input>
  <InputSlot>
    <InputIcon as={SearchIcon} />
  </InputSlot>
  <InputField placeholder="Search..." />
</Input>

<Input isInvalid>
  <InputField />
  <InputSlot>
    <InputIcon as={AlertCircleIcon} className="text-error-500" />
  </InputSlot>
</Input>
```

### Select

```tsx
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";

<Select>
  <SelectTrigger variant="outline" size="md">
    <SelectInput placeholder="Select option" />
    <SelectIcon as={ChevronDownIcon} />
  </SelectTrigger>
  <SelectPortal>
    <SelectBackdrop />
    <SelectContent>
      <SelectDragIndicatorWrapper>
        <SelectDragIndicator />
      </SelectDragIndicatorWrapper>
      <SelectItem label="Option 1" value="1" />
      <SelectItem label="Option 2" value="2" />
    </SelectContent>
  </SelectPortal>
</Select>;
```

### Modal

```tsx
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";

<Modal isOpen={showModal} onClose={handleClose}>
  <ModalBackdrop />
  <ModalContent>
    <ModalHeader>
      <Heading size="lg">Title</Heading>
      <ModalCloseButton>
        <Icon as={CloseIcon} />
      </ModalCloseButton>
    </ModalHeader>
    <ModalBody>
      <Text>Modal content here</Text>
    </ModalBody>
    <ModalFooter>
      <Button onPress={handleClose}>
        <ButtonText>Close</ButtonText>
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>;
```

### Avatar

```tsx
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar";

<Avatar size="md">
  <AvatarFallbackText>JD</AvatarFallbackText>
  <AvatarImage source={{ uri: imageUrl }} />
  <AvatarBadge />
</Avatar>;
```

### Checkbox

```tsx
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";

<Checkbox value="terms" isChecked={isChecked} onChange={setIsChecked}>
  <CheckboxIndicator>
    <CheckboxIcon as={CheckIcon} />
  </CheckboxIndicator>
  <CheckboxLabel>Accept terms</CheckboxLabel>
</Checkbox>;
```

### Toast

```tsx
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

const toast = useToast();

toast.show({
  placement: "top",
  render: ({ id }) => (
    <Toast nativeID={id} action="success">
      <ToastTitle>Success!</ToastTitle>
      <ToastDescription>Your changes have been saved.</ToastDescription>
    </Toast>
  ),
});
```

## Component Variants

### Button Variants

| Prop      | Values                                         |
| --------- | ---------------------------------------------- |
| `action`  | `primary`, `secondary`, `positive`, `negative` |
| `variant` | `solid`, `outline`, `link`                     |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`                   |

### Input Variants

| Prop      | Values                             |
| --------- | ---------------------------------- |
| `variant` | `outline`, `underlined`, `rounded` |
| `size`    | `sm`, `md`, `lg`, `xl`             |

### Text/Heading Sizes

| Component | Sizes                                                                  |
| --------- | ---------------------------------------------------------------------- |
| `Text`    | `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl` |
| `Heading` | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`               |

## When to Keep React Native Primitives

Use React Native primitives only when:

1. **Platform-specific native behavior** - Deep native integration required
2. **Third-party library requirements** - Library expects RN primitives
3. **Performance-critical rendering** - Measured wrapper overhead (rare)
4. **Animated components** - Using `Animated.View`, `Animated.Text`, etc.

```tsx
// Acceptable: Animated primitives
import Animated from "react-native-reanimated";

const AnimatedBox = Animated.createAnimatedComponent(Box);

// Acceptable: Platform-specific requirement
import { Platform, PermissionsAndroid } from "react-native";
```
