# Color Tokens Reference

This reference provides the complete semantic color token system for Gluestack UI v3.

## Token Scale

All color tokens follow the 0-950 scale:

```
0 → 50 → 100 → 200 → 300 → 400 → 500 → 600 → 700 → 800 → 900 → 950
```

Lower values are lighter, higher values are darker.

## Semantic Color Categories

### Primary (Brand Identity)

Use for main brand elements, key interactive components, and primary actions.

| Token         | Usage                            |
| ------------- | -------------------------------- |
| `primary-0`   | Lightest tint, subtle highlights |
| `primary-50`  | Very light backgrounds           |
| `primary-100` | Light hover states               |
| `primary-200` | Light borders                    |
| `primary-300` | Muted elements                   |
| `primary-400` | Subdued text/icons               |
| `primary-500` | **Default** - buttons, links     |
| `primary-600` | Hover states for primary-500     |
| `primary-700` | Active/pressed states            |
| `primary-800` | Dark variant                     |
| `primary-900` | Very dark variant                |
| `primary-950` | Darkest shade                    |

```tsx
<Button className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700">
  <ButtonText className="text-typography-0">Primary Action</ButtonText>
</Button>
```

### Secondary (Supporting Elements)

Use for secondary actions, alternative buttons, and supporting UI.

| Token           | Common Usage      |
| --------------- | ----------------- |
| `secondary-100` | Light backgrounds |
| `secondary-200` | Borders, dividers |
| `secondary-500` | Secondary buttons |
| `secondary-600` | Hover states      |

```tsx
<Button className="bg-secondary-500">
  <ButtonText>Secondary Action</ButtonText>
</Button>
```

### Tertiary (Accent)

Use for tertiary accents and warm tones.

| Token          | Common Usage     |
| -------------- | ---------------- |
| `tertiary-400` | Accents          |
| `tertiary-500` | Tertiary buttons |

### Error (Destructive/Validation)

Use for errors, validation failures, and destructive actions.

| Token       | Common Usage                    |
| ----------- | ------------------------------- |
| `error-50`  | Light error backgrounds         |
| `error-100` | Error container backgrounds     |
| `error-400` | Error icons (light mode)        |
| `error-500` | **Default** - error text, icons |
| `error-600` | Error text (dark mode)          |
| `error-700` | Dark error elements             |

```tsx
// Error message
<Text className="text-error-500">This field is required</Text>

// Error background
<Box className="bg-error-50 border border-error-200 p-4">
  <Text className="text-error-700">Error occurred</Text>
</Box>

// Destructive button
<Button action="negative">
  <ButtonText>Delete</ButtonText>
</Button>
```

### Success (Positive/Confirmation)

Use for success states, confirmations, and positive feedback.

| Token         | Common Usage                      |
| ------------- | --------------------------------- |
| `success-50`  | Light success backgrounds         |
| `success-100` | Success container backgrounds     |
| `success-500` | **Default** - success text, icons |
| `success-600` | Success text emphasis             |
| `success-700` | Dark success elements             |

```tsx
// Success message
<Text className="text-success-600">Changes saved successfully</Text>

// Success background
<Box className="bg-success-50 border border-success-200 p-4">
  <Text className="text-success-700">Operation completed</Text>
</Box>
```

### Warning (Caution/Attention)

Use for warnings, caution states, and attention-required elements.

| Token         | Common Usage                  |
| ------------- | ----------------------------- |
| `warning-50`  | Light warning backgrounds     |
| `warning-100` | Warning container backgrounds |
| `warning-400` | Warning icons                 |
| `warning-500` | **Default** - warning text    |
| `warning-600` | Warning text emphasis         |
| `warning-700` | Dark warning elements         |

```tsx
// Warning message
<Text className="text-warning-600">Please review before proceeding</Text>

// Warning background
<Box className="bg-warning-50 border border-warning-300 p-4">
  <Text className="text-warning-700">Action required</Text>
</Box>
```

### Info (Informational)

Use for informational content, tips, and neutral highlights.

| Token      | Common Usage                   |
| ---------- | ------------------------------ |
| `info-50`  | Light info backgrounds         |
| `info-100` | Info container backgrounds     |
| `info-500` | **Default** - info text, icons |
| `info-600` | Info text emphasis             |
| `info-700` | Dark info elements             |

```tsx
// Info message
<Text className="text-info-600">Tip: You can also use keyboard shortcuts</Text>

// Info background
<Box className="bg-info-50 border border-info-200 p-4">
  <Text className="text-info-700">Learn more about this feature</Text>
</Box>
```

### Typography (Text Colors)

Use for all text content. The scale provides contrast levels.

| Token            | Usage                                |
| ---------------- | ------------------------------------ |
| `typography-0`   | White text (on dark backgrounds)     |
| `typography-50`  | Very light text                      |
| `typography-100` | Light placeholder text               |
| `typography-200` | Disabled text                        |
| `typography-300` | Tertiary text                        |
| `typography-400` | Quaternary text                      |
| `typography-500` | Secondary text, captions             |
| `typography-600` | Muted body text                      |
| `typography-700` | Body text                            |
| `typography-800` | Emphasized text                      |
| `typography-900` | **Default** - headings, primary text |
| `typography-950` | Maximum contrast text                |

```tsx
// Primary heading
<Heading className="text-typography-900">Page Title</Heading>

// Body text
<Text className="text-typography-700">Regular paragraph text</Text>

// Secondary/muted text
<Text className="text-typography-500">Last updated 2 hours ago</Text>

// White text on dark background
<Box className="bg-primary-500">
  <Text className="text-typography-0">Button label</Text>
</Box>
```

### Outline (Borders)

Use for borders, dividers, and outlines.

| Token         | Usage                              |
| ------------- | ---------------------------------- |
| `outline-0`   | White borders                      |
| `outline-50`  | Very subtle borders                |
| `outline-100` | Light dividers                     |
| `outline-200` | **Default** - input borders, cards |
| `outline-300` | Emphasized borders                 |
| `outline-400` | Focus rings (muted)                |
| `outline-500` | Strong borders                     |
| `outline-600` | Dark borders                       |
| `outline-700` | Very dark borders                  |

```tsx
// Card with border
<Box className="border border-outline-200 rounded-lg p-4">
  <Text>Card content</Text>
</Box>

// Input field
<Input className="border border-outline-300 focus:border-primary-500" />

// Divider
<Box className="h-px bg-outline-100 my-4" />
```

### Background (Surface Colors)

Use for component and page backgrounds.

| Token            | Usage                                          |
| ---------------- | ---------------------------------------------- |
| `background-0`   | **Default** - white, main content (light mode) |
| `background-50`  | Elevated surfaces, cards                       |
| `background-100` | Subtle backgrounds                             |
| `background-200` | Muted sections                                 |
| `background-300` | Disabled states                                |
| `background-400` | Hover states (dark)                            |
| `background-500` | Mid-tone                                       |
| `background-600` | Dark surfaces                                  |
| `background-700` | Darker surfaces                                |
| `background-800` | Very dark surfaces                             |
| `background-900` | Near-black                                     |
| `background-950` | **Default** - main content (dark mode)         |

```tsx
// Light mode page
<Box className="bg-background-0 min-h-screen">
  <Box className="bg-background-50 p-4 rounded-lg">
    Card content
  </Box>
</Box>

// Dark mode page
<Box className="bg-background-950 min-h-screen">
  <Box className="bg-background-900 p-4 rounded-lg">
    Card content
  </Box>
</Box>
```

## Special Background Tokens

State-specific background tokens for semantic meaning:

| Token                   | Usage                    |
| ----------------------- | ------------------------ |
| `bg-background-error`   | Error state container    |
| `bg-background-warning` | Warning state container  |
| `bg-background-success` | Success state container  |
| `bg-background-info`    | Info state container     |
| `bg-background-muted`   | Muted/disabled container |

```tsx
// Error state
<Box className="bg-background-error p-4 rounded-lg">
  <Text className="text-error-700">Error message</Text>
</Box>

// Muted/disabled
<Box className="bg-background-muted p-4 rounded-lg opacity-50">
  <Text className="text-typography-500">Disabled content</Text>
</Box>
```

## Indicator Tokens

Use for focus rings and status indicators:

| Token                    | Usage                   |
| ------------------------ | ----------------------- |
| `ring-indicator-primary` | Primary focus indicator |
| `ring-indicator-info`    | Info focus indicator    |
| `ring-indicator-error`   | Error focus indicator   |

## Dark Mode Mapping

Use `dark:` prefix for dark mode variants:

```tsx
// Text that adapts to dark mode
<Text className="text-typography-900 dark:text-typography-0">
  Adaptive text
</Text>

// Background that adapts
<Box className="bg-background-0 dark:bg-background-950">
  <Text className="text-typography-900 dark:text-typography-0">
    Content
  </Text>
</Box>

// Border that adapts
<Box className="border border-outline-200 dark:border-outline-700">
  Content
</Box>
```

## Common Light/Dark Mode Pairs

| Light Mode       | Dark Mode        | Usage           |
| ---------------- | ---------------- | --------------- |
| `background-0`   | `background-950` | Page background |
| `background-50`  | `background-900` | Card background |
| `typography-900` | `typography-0`   | Primary text    |
| `typography-700` | `typography-200` | Body text       |
| `typography-500` | `typography-400` | Secondary text  |
| `outline-200`    | `outline-700`    | Borders         |
| `outline-100`    | `outline-800`    | Dividers        |

## Prohibited Raw Color Usage

Never use raw Tailwind colors. Map to semantic tokens:

| Raw Color                     | Semantic Token                              |
| ----------------------------- | ------------------------------------------- |
| `red-*`                       | `error-*`                                   |
| `green-*`                     | `success-*`                                 |
| `yellow-*`, `amber-*`         | `warning-*`                                 |
| `blue-*`, `cyan-*`            | `info-*` or `primary-*`                     |
| `gray-*`, `slate-*`, `zinc-*` | `typography-*`, `outline-*`, `background-*` |
| `white`                       | `typography-0` or `background-0`            |
| `black`                       | `typography-950` or `background-950`        |
