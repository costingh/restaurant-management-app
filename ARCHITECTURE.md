# Technical Architecture Documentation

## System Overview

The Restaurant Management System is a full-stack web application that follows a hybrid architecture, combining modern React frontend technologies with a backend that's transitioning from Express to NestJS.

## Architecture Diagram

```
┌─────────────────┐      ┌──────────────────────────────────────┐      ┌────────────────┐
│                 │      │                                      │      │                │
│  React Frontend │━━━━━▶│  Express/NestJS Hybrid Backend       │━━━━━▶│  PostgreSQL    │
│                 │◀━━━━━│                                      │◀━━━━━│  Database      │
│                 │      │                                      │      │                │
└─────────────────┘      └──────────────────────────────────────┘      └────────────────┘
```

## Technology Stack

### Frontend
- **React** with **TypeScript** for type safety
- **Wouter** for lightweight routing
- **TanStack React Query** (formerly React Query) for data fetching and cache management
- **Zod** for schema validation
- **React Hook Form** for form handling
- **Shadcn UI** components built on Radix UI primitives
- **Tailwind CSS** for styling

### Backend
- **Express.js** for legacy API routes and serving the frontend
- **NestJS** for new API routes (transitional architecture)
- **Passport.js** for authentication
- **Session-based** authentication using cookies
- **Zod** for input validation

### Database
- **PostgreSQL** as the relational database
- **Drizzle ORM** for database operations
- **Database Schema** defined in the shared layer with TypeScript types

## Code Organization

```
├── client/               # Frontend React application
│   ├── src/              
│   │   ├── components/   # Reusable UI components
│   │   │   ├── ui/       # Shadcn UI components
│   │   │   └── ...       # Application-specific components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and types
│   │   ├── pages/        # Page components
│   │   │   ├── admin/    # Admin pages
│   │   │   └── ...       # Public pages
│   │   └── App.tsx       # Main application component
├── server/               # Backend server
│   ├── modules/          # NestJS modules
│   │   ├── auth/         # Authentication
│   │   ├── database/     # Database services
│   │   ├── restaurants/  # Restaurant endpoints
│   │   ├── menu-items/   # Menu item endpoints
│   │   └── reviews/      # Review endpoints
│   ├── routes.ts         # Express routes (legacy)
│   ├── storage.ts        # Storage interface and implementation
│   ├── db.ts             # Database connection
│   └── index.ts          # Server entry point
└── shared/               # Shared code between client and server
    └── schema.ts         # Database schema and type definitions
```

## Data Flow

1. **Frontend to Backend**: 
   - React components use React Query hooks to fetch data
   - API requests are made using the `apiRequest` utility
   - Forms use React Hook Form with Zod validation

2. **Backend Processing**:
   - Request validation using Zod schemas
   - Authentication check using Passport.js
   - Business logic handled by Express route handlers or NestJS services
   - Data access through the `IStorage` interface

3. **Database Interaction**:
   - Drizzle ORM is used to interact with PostgreSQL
   - Queries are type-safe via TypeScript types generated from schema

## Key Architectural Patterns

### Repository Pattern
The application uses a repository pattern implemented through the `IStorage` interface, which abstracts the data access layer and makes it easy to switch between different storage implementations.

```typescript
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  // ... other methods
}

export class DatabaseStorage implements IStorage {
  // Implementation using Drizzle ORM
}
```

### Dependency Injection (NestJS)
The NestJS modules use dependency injection for services:

```typescript
@Injectable()
export class RestaurantsService {
  constructor(private readonly databaseService: DatabaseService) {}
  
  // Service methods
}
```

### Type-Safe API Communication
Shared types between frontend and backend ensure type safety across the stack:

```typescript
// Shared schema and types
export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;

// Frontend usage
const { data } = useQuery<Restaurant[]>({ queryKey: ['/api/restaurants'] });
```

## Authentication Flow

1. User submits credentials via the login form
2. Backend validates credentials using Passport LocalStrategy
3. If valid, user information is stored in session
4. Session cookie is sent to client and used for subsequent requests
5. Protected routes check session for authentication status

```
┌──────────┐                ┌─────────┐               ┌────────────┐
│          │ 1. Login       │         │ 2. Verify     │            │
│  Client  │────────────────▶ Server  │───────────────▶ Database   │
│          │                │         │               │            │
│          │◀───────────────│         │◀──────────────│            │
│          │ 3. Session     │         │ 4. User Data  │            │
└──────────┘                └─────────┘               └────────────┘
```

## State Management

- **Server State**: Managed by React Query with stale-while-revalidate pattern
- **Form State**: Managed by React Hook Form
- **UI State**: Managed by React's built-in state hooks

## Error Handling

1. **Client-Side Validation**: Form inputs are validated using Zod schemas
2. **API Error Handling**: API responses are checked and errors are thrown with status codes
3. **Error Display**: Toast notifications for user feedback
4. **API Error Responses**: Structured error responses with message and status

## Performance Considerations

- React Query caching for efficient API calls
- Server-side pagination (to be implemented)
- Database indexing for common queries
- Normalized database schema to reduce redundancy

## Security Considerations

- CSRF protection via same-site cookies
- Input validation on both client and server
- Session timeout and secure cookie settings
- Permission-based access control (Admin vs User roles)

## Transitional Architecture

The application is in transition from Express to NestJS:

1. **Current State**: Hybrid architecture with both Express routes and NestJS modules
2. **Migration Strategy**: Incrementally move functionality from Express to NestJS modules
3. **End Goal**: Complete NestJS application with Express only serving as entry point

The `IStorage` interface is key to this transition, allowing gradual migration of data access logic.

## Deployment Considerations

- Environment variables for configuration
- PostgreSQL database connection
- Static file serving for production build
- Health checks for monitoring

## Future Architecture Improvements

- Complete migration to NestJS
- Implement GraphQL API for more flexible data fetching
- Add WebSocket support for real-time features
- Implement more comprehensive caching strategy
- Add automated testing framework