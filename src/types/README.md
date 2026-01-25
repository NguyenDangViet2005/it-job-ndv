# Type System Organization

## Structure Overview

```
types/
├── index.ts                    # Central export point
├── api.type.ts                 # API requests & responses
├── common.type.ts              # Shared UI component types
├── component.type.ts           # Component props types
├── page.type.ts                # Page component props
├── form.type.ts                # Form-related types
├── post-card.types.ts          # Legacy post card types (backward compatibility)
└── models/                     # Domain model types
    ├── user.type.ts
    ├── company.type.ts
    ├── job.type.ts
    ├── blog.type.ts
    ├── post.type.ts
    ├── application.type.ts
    ├── review.type.ts
    ├── follow.type.ts
    ├── connection.type.ts
    └── location.type.ts
```

## File Purposes

### `index.ts`
Central export point for all types. Import from `@/types` to access any type.

### `api.type.ts`
- API request interfaces (e.g., `LoginRequest`, `RegisterRequest`)
- API response types (e.g., `LoginResponse`, `ApiResponse<T>`)
- Generic response wrappers (`ResponseData<T>`)

### `models/*.type.ts`
Domain entity types representing database models:
- **user.type.ts**: User, PostUser, UserProfile
- **company.type.ts**: Company, PostCompany
- **job.type.ts**: Job, Skill
- **post.type.ts**: Post, Comment, Attachment, Like, PostInteraction
- **application.type.ts**: Application
- **review.type.ts**: Review
- **follow.type.ts**: Follow
- **connection.type.ts**: Connection
- **location.type.ts**: Province, Ward

### `component.type.ts`
Props interfaces for reusable components:
- QA/Post components (MainContentProps, PostListProps)
- Job components (JobListSectionProps, JobHeaderProps)
- Common components (HeroSectionProps, UserDropdownProps)
- Layout components (QAPageLayoutProps)
- Table components (DataTableProps, Column)

### `page.type.ts`
Props interfaces for page-level components:
- User pages (ProfilePageProps, JobDetailPageProps)
- Admin pages (SocialPlatform, SocialPost)

### `common.type.ts`
Shared UI component types:
- Logo components (LogoItem, LogoLoopProps)
- Animation components (AnimatedItemProps, AnimatedListProps)
- Sheet components (SheetContentProps)
- Pagination (PaginationLinkProps)
- Form contexts (FormFieldContextValue, FormItemContextValue)

### `form.type.ts`
Form-related types and validation schemas.

### `post-card.types.ts`
Legacy types for backward compatibility with old post card implementation:
- LegacyComment, LegacyPost, PostType
- Helper functions for data normalization
- Will be deprecated once migration is complete

## Import Guidelines

### ✅ Correct Usage

```typescript
// Import from central index
import type { User, Company, LoginRequest, ApiResponse } from "@/types";

// Import specific model if needed
import type { Post, Comment } from "@/types/models/post.type";

// Import component props
import type { MainContentProps, JobListSectionProps } from "@/types";
```

### ❌ Avoid

```typescript
// Don't import from individual files directly (unless necessary)
import type { User } from "@/types/models/user.type";

// Don't create duplicate type definitions
// Always check if type exists before creating new one
```

## Type Naming Conventions

### Models
- PascalCase entity names: `User`, `Company`, `Post`
- Descriptive variants: `PostUser`, `PostCompany` (for nested data)

### API Types
- Request suffix: `LoginRequest`, `RegisterRequest`
- Response suffix: `LoginResponse`, `UserResponse`
- Generic wrappers: `ApiResponse<T>`, `ResponseData<T>`

### Component Props
- Props suffix: `MainContentProps`, `JobHeaderProps`
- Descriptive names: `JobListSectionProps` (not just `JobListProps`)

### Page Props
- PageProps suffix: `ProfilePageProps`, `JobDetailPageProps`

## Avoiding Duplicates

Before creating a new type:
1. Check `index.ts` exports
2. Search in `models/` folder
3. Check `api.type.ts` for API-related types
4. Check `component.type.ts` for component props
5. Check `common.type.ts` for shared UI types

## Migration Notes

### Deprecated Types
- `LegacyComment`, `LegacyPost` in `post-card.types.ts` - Use `Comment`, `Post` from `models/post.type.ts`
- Old inline type definitions - Migrate to appropriate type files

### Removed Duplicates (v2.0)
- ❌ `JobData` in `page.type.ts` - Use `Job` from `models/job.type.ts`
- ❌ `Application` in `page.type.ts` - Use `Application` from `models/application.type.ts`
- ❌ `LegacyComment`, `LegacyPost`, `PostType` in `models/post.type.ts` - Moved to `post-card.types.ts`

## Best Practices

1. **Single Source of Truth**: Each type should be defined in only one place
2. **Logical Organization**: Group related types together
3. **Clear Naming**: Use descriptive names that indicate purpose
4. **Type Reuse**: Use `Pick`, `Omit`, `Partial` to derive types
5. **Documentation**: Add comments for complex types
6. **Import from Index**: Always import from `@/types` for consistency

## Examples

### Creating a New Model Type

```typescript
// IT-JOB/src/types/models/notification.type.ts
export interface Notification {
  id: number;
  userId: number;
  type: "info" | "warning" | "error";
  message: string;
  read: boolean;
  createdAt: string;
}

// Add to index.ts
export * from "./models/notification.type";
```

### Creating Component Props

```typescript
// IT-JOB/src/types/component.type.ts
export interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}
```

### Creating API Types

```typescript
// IT-JOB/src/types/api.type.ts
export interface NotificationRequest {
  userId: number;
  type: string;
  message: string;
}

export type NotificationResponse = Notification;
```
