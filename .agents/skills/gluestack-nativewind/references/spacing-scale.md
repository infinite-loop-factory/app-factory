# Spacing Scale Reference

This reference provides the complete spacing scale for NativeWind/Tailwind CSS. Use only these values for consistent, maintainable layouts.

## Standard Spacing Scale

| Class Suffix | Pixels | Rem      | Usage                            |
| ------------ | ------ | -------- | -------------------------------- |
| `0`          | 0px    | 0rem     | Reset spacing                    |
| `px`         | 1px    | -        | Hairline borders, minimal offset |
| `0.5`        | 2px    | 0.125rem | Micro spacing                    |
| `1`          | 4px    | 0.25rem  | Tight spacing                    |
| `1.5`        | 6px    | 0.375rem | Compact spacing                  |
| `2`          | 8px    | 0.5rem   | Small spacing                    |
| `2.5`        | 10px   | 0.625rem | Small-medium spacing             |
| `3`          | 12px   | 0.75rem  | Medium-small spacing             |
| `3.5`        | 14px   | 0.875rem | Medium spacing                   |
| `4`          | 16px   | 1rem     | **Default** - standard spacing   |
| `5`          | 20px   | 1.25rem  | Medium-large spacing             |
| `6`          | 24px   | 1.5rem   | Large spacing                    |
| `7`          | 28px   | 1.75rem  | Large+ spacing                   |
| `8`          | 32px   | 2rem     | Extra large spacing              |
| `9`          | 36px   | 2.25rem  | XL spacing                       |
| `10`         | 40px   | 2.5rem   | XXL spacing                      |
| `11`         | 44px   | 2.75rem  | Touch target minimum             |
| `12`         | 48px   | 3rem     | Section spacing                  |
| `14`         | 56px   | 3.5rem   | Large section spacing            |
| `16`         | 64px   | 4rem     | Major section spacing            |
| `20`         | 80px   | 5rem     | Page section spacing             |
| `24`         | 96px   | 6rem     | Hero spacing                     |
| `28`         | 112px  | 7rem     | Extra hero spacing               |
| `32`         | 128px  | 8rem     | Maximum spacing                  |
| `36`         | 144px  | 9rem     | Oversized spacing                |
| `40`         | 160px  | 10rem    | Oversized spacing                |
| `44`         | 176px  | 11rem    | Oversized spacing                |
| `48`         | 192px  | 12rem    | Oversized spacing                |
| `52`         | 208px  | 13rem    | Oversized spacing                |
| `56`         | 224px  | 14rem    | Oversized spacing                |
| `60`         | 240px  | 15rem    | Oversized spacing                |
| `64`         | 256px  | 16rem    | Oversized spacing                |
| `72`         | 288px  | 18rem    | Oversized spacing                |
| `80`         | 320px  | 20rem    | Oversized spacing                |
| `96`         | 384px  | 24rem    | Maximum oversized                |

## Spacing Properties

### Padding

| Property          | Classes      |
| ----------------- | ------------ |
| All sides         | `p-{scale}`  |
| Horizontal        | `px-{scale}` |
| Vertical          | `py-{scale}` |
| Top               | `pt-{scale}` |
| Right             | `pr-{scale}` |
| Bottom            | `pb-{scale}` |
| Left              | `pl-{scale}` |
| Start (RTL-aware) | `ps-{scale}` |
| End (RTL-aware)   | `pe-{scale}` |

```tsx
// Uniform padding
<Box className="p-4" />  // 16px all sides

// Horizontal and vertical
<Box className="px-6 py-4" />  // 24px horizontal, 16px vertical

// Individual sides
<Box className="pt-2 pr-4 pb-6 pl-4" />
```

### Margin

| Property          | Classes                              |
| ----------------- | ------------------------------------ |
| All sides         | `m-{scale}`                          |
| Horizontal        | `mx-{scale}`                         |
| Vertical          | `my-{scale}`                         |
| Top               | `mt-{scale}`                         |
| Right             | `mr-{scale}`                         |
| Bottom            | `mb-{scale}`                         |
| Left              | `ml-{scale}`                         |
| Start (RTL-aware) | `ms-{scale}`                         |
| End (RTL-aware)   | `me-{scale}`                         |
| Auto              | `m-auto`, `mx-auto`, `my-auto`, etc. |

```tsx
// Centered horizontally
<Box className="mx-auto" />

// Stack spacing
<Box className="mb-4" />  // 16px bottom margin

// Negative margin (use sparingly)
<Box className="-mt-2" />  // -8px top margin
```

### Gap (Flexbox/Grid)

| Property   | Classes         |
| ---------- | --------------- |
| Both axes  | `gap-{scale}`   |
| Row gap    | `gap-y-{scale}` |
| Column gap | `gap-x-{scale}` |

```tsx
// Uniform gap in flex container
<Box className="flex flex-row gap-4">
  <Item />
  <Item />
  <Item />
</Box>

// Grid with different gaps
<Box className="grid grid-cols-3 gap-x-6 gap-y-4">
  <Item />
  <Item />
  <Item />
</Box>
```

### Space Between (Legacy Alternative)

Use `gap-*` instead when possible, but `space-*` is available:

| Property   | Classes           |
| ---------- | ----------------- |
| Horizontal | `space-x-{scale}` |
| Vertical   | `space-y-{scale}` |

```tsx
// Vertical stack with space between
<Box className="flex flex-col space-y-4">
  <Item />
  <Item />
</Box>
```

## Common Spacing Patterns

### Card Padding

```tsx
// Compact card
<Box className="p-3" />  // 12px

// Standard card
<Box className="p-4" />  // 16px

// Spacious card
<Box className="p-6" />  // 24px
```

### List Item Spacing

```tsx
// Tight list
<Box className="py-2 px-3" />  // 8px vertical, 12px horizontal

// Standard list
<Box className="py-3 px-4" />  // 12px vertical, 16px horizontal

// Spacious list
<Box className="py-4 px-6" />  // 16px vertical, 24px horizontal
```

### Section Spacing

```tsx
// Between sections
<Box className="my-8" />  // 32px vertical margin

// Page sections
<Box className="py-12" />  // 48px vertical padding

// Hero sections
<Box className="py-16" />  // 64px vertical padding
```

### Button Padding

```tsx
// Small button
<Button className="px-3 py-1.5" />  // 12px horizontal, 6px vertical

// Medium button
<Button className="px-4 py-2" />  // 16px horizontal, 8px vertical

// Large button
<Button className="px-6 py-3" />  // 24px horizontal, 12px vertical
```

### Form Field Spacing

```tsx
// Form field group
<Box className="space-y-4">  // 16px between fields
  <Input />
  <Input />
  <Button />
</Box>

// Form section
<Box className="space-y-6">  // 24px between sections
  <FormSection />
  <FormSection />
</Box>
```

### Touch Targets

Minimum touch target size is 44x44px (11 spacing units):

```tsx
// Icon button with minimum touch target
<Pressable className="h-11 w-11 items-center justify-center">
  <Icon />
</Pressable>

// Touch target with padding
<Pressable className="p-3">  // At least 12px padding
  <Text>Tappable</Text>
</Pressable>
```

## Prohibited Patterns

### Arbitrary Values

Never use bracket notation for spacing:

```tsx
// WRONG
<Box className="p-[13px]" />
<Box className="m-[27px]" />
<Box className="gap-[15px]" />

// CORRECT - use nearest scale value
<Box className="p-3" />   // 12px instead of 13px
<Box className="m-7" />   // 28px instead of 27px
<Box className="gap-4" /> // 16px instead of 15px
```

### Inline Style Spacing

Never use inline styles for spacing:

```tsx
// WRONG
<Box style={{ padding: 13 }} />
<Box style={{ marginTop: 27 }} />

// CORRECT
<Box className="p-3" />
<Box className="mt-7" />
```

### Non-Scale Decimals

Only use defined decimal values:

```tsx
// WRONG
<Box className="p-2.7" />
<Box className="m-4.3" />

// CORRECT - allowed decimals: 0.5, 1.5, 2.5, 3.5
<Box className="p-2.5" />
<Box className="m-4" />
```

## Responsive Spacing

Apply different spacing at breakpoints:

```tsx
// Smaller padding on mobile, larger on desktop
<Box className="p-4 md:p-6 lg:p-8" />

// Responsive gap
<Box className="gap-2 md:gap-4 lg:gap-6" />

// Responsive margin
<Box className="mt-4 md:mt-8 lg:mt-12" />
```

## Spacing Decision Guide

| Context           | Recommended Values               |
| ----------------- | -------------------------------- |
| Icon spacing      | `1`, `1.5`, `2`                  |
| Text line spacing | `1`, `2`, `3`                    |
| Button padding    | `2-3` vertical, `3-6` horizontal |
| Card padding      | `3`, `4`, `6`                    |
| List item padding | `2-4` vertical, `3-4` horizontal |
| Section spacing   | `6`, `8`, `12`, `16`             |
| Page margins      | `4`, `6`, `8`                    |
| Modal padding     | `4`, `6`                         |
| Form field gap    | `3`, `4`                         |
| Touch targets     | minimum `11` (44px)              |
