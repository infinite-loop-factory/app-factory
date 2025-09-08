# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the reaction-speed-test app within a Turbo monorepo. It's a reaction speed test game with user authentication and score tracking built with Expo React Native.

### Architecture

- **Framework**: Expo SDK 52+ with React Native 0.76.9
- **Language**: TypeScript 5.3+
- **Navigation**: Expo Router v4 (file-based routing)
- **Styling**: NativeWind (Tailwind CSS) + Gluestack UI v2
- **Backend**: Supabase (auth, database, real-time)
- **State Management**: Jotai atoms, React hooks
- **Forms**: React Hook Form + Zod validation
- **Testing**: Jest + React Native Testing Library
- **Code Quality**: Biome (formatting/linting)

## Essential Commands

### Development
```bash
# Install dependencies (run from monorepo root)
cd ../../ && pnpm install

# Start development server
pnpm start      # General start
pnpm ios        # iOS simulator
pnpm android    # Android emulator  
pnpm web        # Web browser

# Build for development/testing
pnpm build:dev  # EAS development build
```

### Code Quality
```bash
# Lint and format
pnpm lint       # Biome linter
pnpm type-check # TypeScript checking

# Testing
pnpm test           # Run tests once
pnpm test:watch     # Watch mode for development
```

### Supabase (Database & Auth)
```bash
# Local Supabase development
supabase start    # Starts local Supabase stack
supabase stop     # Stops local stack
supabase status   # Check running services

# Database migrations
supabase db reset # Reset local DB with migrations
```

## Code Organization & Patterns

### App Structure
```
app/                    # Expo Router pages (file-based routing)
  (pages)/             # Route group - main app pages
    _layout.tsx        # Layout for authenticated pages
    index.tsx          # Home/main menu
    measurement.tsx    # Core reaction test game
    results.tsx        # User results & statistics
    login.tsx          # Authentication
    settings.tsx       # App configuration
    
components/            # Reusable React Native components
  ui/                 # Gluestack UI component system
  AuthGuard.tsx       # Authentication wrapper
  WebviewLayout.tsx   # Web-specific layout wrapper
  measurement/        # Reaction test specific components
  results/           # Results display components
  login/             # Auth form components

hooks/                 # Custom React hooks
  useAuth.ts          # Authentication state & methods
  useReactionTimer.ts # Core game timing logic
  useRecordStatistics.ts # Score/stats calculations

services/             # External API integration
  records.ts          # Supabase score/record operations
  user.ts            # User profile operations
  localRecords.ts     # Offline score storage

utils/                # Pure utility functions
  supabase.ts         # Supabase client configuration
  date.ts            # Date/time formatting helpers
  autoLoginStorage.ts # Persistent auth storage

constants/            # Static configuration
  env.ts             # Environment variables (with Zod validation)
  routes.ts          # Route definitions and navigation
```

### Key Conventions

**File Naming**: kebab-case (`user-profile.tsx`, `api-client.ts`)
**Components**: PascalCase (`AuthGuard`, `ReactionTimer`)  
**Functions/Variables**: camelCase (`getUserStats`, `currentScore`)
**Constants**: UPPER_SNAKE_CASE (`MAX_ATTEMPTS`, `DEFAULT_TIMEOUT`)
**Types**: PascalCase without `I` prefix (`User`, `GameRecord`)

### Styling System

**Primary**: NativeWind classes (Tailwind CSS syntax)
```tsx
<View className="flex-1 bg-white p-4 justify-center">
  <Text className="text-xl font-bold text-center text-gray-800">
```

**UI Components**: Gluestack UI v2 system
```tsx
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
```

### State Management

**Global State**: Jotai atoms for simple shared state
**Local State**: React `useState` for component-specific state  
**Forms**: React Hook Form + Zod schemas
**Server State**: Direct Supabase calls (no React Query in this app)

### Authentication Flow

- Supabase Auth with email/password
- `AuthGuard` component protects authenticated routes
- `useAuth` hook provides auth state and methods
- Auto-login persistence via AsyncStorage
- Real-time auth state synchronization

### Testing Strategy

- Jest configuration in `jest.config.ts`
- Test setup in `jest.setup.ts` 
- Component testing with React Native Testing Library
- Snapshots for UI regression testing

## Important Implementation Notes

### Environment Configuration
- Environment variables defined in `constants/env.ts` with Zod validation
- Supabase configuration in `utils/supabase.ts`
- Local development uses `supabase/config.toml` settings

### Navigation Architecture  
- Expo Router with file-based routing
- `(pages)` route group for main app screens
- `AuthGuard` wraps protected routes
- `useAuthAwareNavigation` for auth-aware routing

### Cross-Platform Considerations
- Web-specific layout handling via `WebviewLayout`
- Platform-specific component variants (`.native.tsx`, `.web.tsx`)
- React Native WebSocket polyfills for Supabase real-time

### Performance Considerations
- `DelayRender` component for deferred rendering
- Optimized reaction timing using high-precision timers
- Efficient score calculations and statistics aggregation

## Development Workflow

1. **Setup**: Run `pnpm install` from repository root (`../../`)
2. **Start**: Use `pnpm start` for development server
3. **Database**: Start local Supabase with `supabase start` for full functionality
4. **Code Quality**: Run `pnpm lint` before committing
5. **Testing**: Use `pnpm test:watch` during development

## Architecture Decision Records

- **No React Query**: Direct Supabase calls for simplicity in this focused app
- **Jotai over Redux**: Atomic state management for simpler patterns
- **Gluestack UI**: Consistent cross-platform component system
- **Expo Router**: File-based routing for React Native
- **Supabase**: Integrated backend-as-a-service for rapid development