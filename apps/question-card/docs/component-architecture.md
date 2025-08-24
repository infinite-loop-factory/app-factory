# Component Architecture Guide

EasyTalking 프로젝트의 컴포넌트 아키텍처 및 파일 구조 가이드입니다.

## 📁 Component Directory Structure

### After Restructuring (Current)
```
src/
├── app/                              # Expo Router (file-based routing only)
│   ├── index.tsx                     # Re-export: screens/IndexScreen
│   ├── category-selection.tsx        # Re-export: screens/CategorySelectionScreen
│   ├── _layout.tsx                   # Root navigation layout
│   ├── +html.tsx                     # Web HTML template
│   └── +not-found.tsx                # 404 error handling
├── components/                       # All reusable components
│   ├── screens/                      # Screen components (main UI logic)
│   │   ├── IndexScreen.tsx           # Splash/loading screen
│   │   └── CategorySelectionScreen.tsx # Category selection logic
│   ├── ui/                          # Reusable UI components (future)
│   │   ├── QuestionCard.tsx
│   │   ├── CheckboxItem.tsx
│   │   └── HeaderBar.tsx
│   ├── navigation/                   # Navigation components
│   │   └── TabBarIcon.tsx
│   └── [legacy components...]        # Existing Expo template components
└── [other directories...]
```

### Before Restructuring (Legacy)
```
src/
├── app/
│   ├── (tabs)/                       # ❌ Removed - unnecessary tab structure
│   │   ├── _layout.tsx
│   │   ├── index.tsx                # Full component with JSX
│   │   └── explore.tsx
│   ├── category-selection.tsx        # Full component with JSX
│   └── [other files...]
└── components/                       # Limited reusable components
```

## 🏗️ Architecture Principles

### 1. Separation of Concerns
- **App Directory**: Expo Router routing logic only (re-exports)
- **Components Directory**: All UI logic, state management, and rendering
- **Clean Separation**: Route files contain no JSX or business logic

### 2. Component Organization
- **screens/**: Full page components with complete functionality
- **ui/**: Reusable UI components (buttons, cards, etc.)
- **navigation/**: Navigation-specific components
- **Legacy**: Existing Expo template components (to be refactored)

### 3. Re-export Pattern
App router files use clean re-export syntax:
```typescript
// ✅ Current pattern
export { default } from "../components/screens/IndexScreen";

// ❌ Avoid (unnecessary intermediate import)
import IndexScreen from "../components/screens/IndexScreen";
export default IndexScreen;
```

## 🔄 Migration Process

### What Was Changed
1. **Removed (tabs) directory** - Unnecessary tab navigation structure
2. **Moved screen components** to `src/components/screens/`
3. **Updated route files** to use re-export pattern
4. **Maintained import paths** - All relative imports updated correctly

### Files Affected
- `src/app/index.tsx` - Converted to re-export
- `src/app/category-selection.tsx` - Converted to re-export  
- `src/components/screens/IndexScreen.tsx` - New location
- `src/components/screens/CategorySelectionScreen.tsx` - New location
- `src/app/(tabs)/` - Directory removed entirely

## 📋 Implementation Guidelines

### Screen Components
```typescript
// src/components/screens/ExampleScreen.tsx
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

export default function ExampleScreen() {
  const router = useRouter();
  
  return (
    <View>
      <Text>Screen Content</Text>
    </View>
  );
}
```

### Route Files
```typescript
// src/app/example.tsx
export { default } from "../components/screens/ExampleScreen";
```

### UI Components (Future)
```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
}

export default function Button({ title, onPress }: ButtonProps) {
  return (
    // Button implementation
  );
}
```

## 🎯 Benefits

### 1. Clear Separation
- Routes handle navigation only
- Components handle UI logic
- Easy to locate and maintain code

### 2. Reusability
- Screen components can be imported anywhere
- UI components designed for maximum reuse
- Clear component hierarchy

### 3. Scalability
- Easy to add new screens
- Component organization scales with project size
- Consistent patterns across all files

### 4. Testing
- Screen components can be unit tested independently
- Route logic separated from UI logic
- Mock navigation easily in tests

## 🔧 Development Workflow

### Adding New Screens
1. Create screen component in `src/components/screens/`
2. Add route file in `src/app/` with re-export
3. Update navigation in `_layout.tsx` if needed

### Adding UI Components
1. Create component in `src/components/ui/`
2. Export from appropriate index file
3. Import and use in screen components

### Refactoring Legacy Components
1. Move from root `components/` to appropriate subdirectory
2. Update import paths throughout project
3. Ensure TypeScript compliance

## 🚦 Quality Standards

### File Naming
- **Screen components**: `ExampleScreen.tsx` (PascalCase + "Screen")
- **UI components**: `Button.tsx` (PascalCase)
- **Route files**: `example.tsx` (kebab-case matching URL)

### Export Pattern
- **Default exports**: All screen and UI components
- **Re-exports**: All route files use `export { default } from`
- **Named exports**: Utility functions and types

### TypeScript
- All components must have proper TypeScript interfaces
- Props interfaces defined for reusable components
- No `any` types - use proper typing

### Lint Compliance
- All files must pass `npm run lint`
- Proper import/export sorting
- No unused imports or variables

## 📚 Related Documentation

- [Development Plan](./development-plan.md) - Overall project roadmap
- [Coding Standards](./coding-standards.md) - Code quality guidelines
- [Design System](./design-system.md) - UI component specifications
- [Biome Lint Guide](./biome-lint-guide.md) - Lint troubleshooting

## 🔄 Next Steps

### Phase 2: UI Components
1. Create remaining screen components
2. Build reusable UI component library
3. Implement design system tokens

### Phase 3: Refactoring
1. Move legacy components to appropriate directories
2. Standardize naming conventions
3. Improve TypeScript coverage

This architecture provides a solid foundation for scalable React Native development with clear separation of concerns and maintainable code organization.