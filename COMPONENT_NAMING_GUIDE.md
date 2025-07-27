# Component Naming Convention Guide

## File Naming Standards

### Components
- **Main Components**: `PascalCase.tsx` (e.g., `HeroSection.tsx`, `AuthProvider.tsx`)
- **UI Components**: `PascalCase.tsx` (e.g., `Button.tsx`, `Card.tsx`)
- **Page Components**: `PascalCase.tsx` (e.g., `AdminDashboard.tsx`, `Security.tsx`)

### Hooks
- **Custom Hooks**: `usePascalCase.ts` (e.g., `useUserRole.ts`, `useSecurityMonitor.ts`)
- **Utility Hooks**: `usePascalCase.ts` (e.g., `useAsyncState.ts`, `useSecureStorage.ts`)

### Utilities
- **Utility Files**: `camelCase.ts` (e.g., `utils.ts`, `validators.ts`)
- **Config Files**: `camelCase.ts` (e.g., `constants.ts`, `api.ts`)

## Export Patterns

### Components
```typescript
// Primary export pattern for components
export interface ComponentNameProps {
  // props definition
}

export const ComponentName: React.FC<ComponentNameProps> = ({ props }) => {
  // component implementation
};

// Always provide default export for easier importing
export default ComponentName;
```

### Hooks
```typescript
// Hook export pattern
export interface HookReturnType {
  // return type definition
}

export const useHookName = (): HookReturnType => {
  // hook implementation
};

// Provide default export for consistency
export default useHookName;
```

### HOCs (Higher-Order Components)
```typescript
// HOC export pattern
export interface WithFeatureOptions {
  // options interface
}

export function withFeature<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: WithFeatureOptions
): React.FC<P> {
  // HOC implementation
}

export default withFeature;
```

## Import Standards

### Preferred Import Style
```typescript
// Named imports for better tree-shaking
import { ComponentName } from '@/components/ComponentName';
import { useHookName } from '@/hooks/useHookName';

// Default imports when component has default export
import ComponentName from '@/components/ComponentName';
import useHookName from '@/hooks/useHookName';
```

### Path Aliases
- `@/` - src root directory
- `@/components/` - all React components
- `@/hooks/` - custom React hooks
- `@/utils/` - utility functions
- `@/types/` - TypeScript type definitions
- `@/integrations/` - third-party integrations

## Directory Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── auth/         # Authentication components
│   │   ├── AuthProvider.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleGuard.tsx
│   ├── admin/        # Admin-specific components
│   └── security/     # Security-related components
├── hooks/            # Custom React hooks
│   ├── useUserRole.ts
│   └── useSecurityMonitor.ts
├── pages/            # Page components
└── utils/            # Utility functions
```

## Interface and Type Naming

### Component Props
```typescript
// Always suffix with Props
export interface ComponentNameProps {
  children?: React.ReactNode;
  className?: string;
  // other props...
}
```

### Hook Return Types
```typescript
// Descriptive naming for hook return types
export interface UserRoleData {
  role: UserRole | null;
  loading: boolean;
  // other return values...
}
```

### Enums and Union Types
```typescript
// PascalCase for type names
export type UserRole = 'owner' | 'admin' | 'user';
export type SecurityEventType = 'failed_auth' | 'suspicious_activity';
```

## Best Practices

1. **Consistency**: Always follow the same pattern across the codebase
2. **Descriptive Names**: Use clear, descriptive names that explain the component's purpose
3. **TypeScript First**: Always define proper TypeScript interfaces
4. **Default Exports**: Provide default exports for easier importing
5. **Named Exports**: Also provide named exports for better tree-shaking
6. **Props Interface**: Always define a props interface for components
7. **Return Type**: Define return types for hooks and complex functions
8. **Display Names**: Set displayName for HOCs and wrapped components

## Migration Checklist

- [ ] File names use correct casing (PascalCase for components, camelCase for utilities)
- [ ] Components have proper TypeScript interfaces
- [ ] Export patterns are consistent (named + default exports)
- [ ] Import paths use correct aliases (@/)
- [ ] Components are in appropriate directories
- [ ] Props interfaces are suffixed with "Props"
- [ ] Hook names start with "use"
- [ ] All components have proper displayName when wrapped
