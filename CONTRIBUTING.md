# Contributing to the Restaurant Management System

Thank you for considering contributing to the Restaurant Management System! This document provides guidelines and instructions for contributing to the project.

## Development Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a PostgreSQL database (or use the provided environment variables)
4. Start the development server:
   ```bash
   npm run dev
   ```

## Architecture Overview

The application follows a hybrid architecture with:

- **Frontend**: React with TypeScript, using Wouter for routing and React Query for data fetching
- **Backend**: 
  - Express server for legacy routes and serving the frontend
  - NestJS modules for new features and gradual migration
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication with Passport.js

## Code Style and Standards

- **TypeScript**: Use TypeScript for all new code
- **Code Formatting**: Follow the existing code style and indentation
- **JSDoc Comments**: Add JSDoc comments to document functions, components, and classes
- **Error Handling**: Implement proper error handling and display user-friendly error messages

## Database Changes

1. **Schema Changes**: 
   - Update the schema definitions in `shared/schema.ts`
   - Define appropriate relations between entities
   
2. **Apply Migrations**:
   ```bash
   npm run db:push
   ```

## Adding New Features

### Adding a New Entity

1. **Define Schema**:
   - Add the entity definition in `shared/schema.ts`
   - Define relations with other entities

2. **Update Storage Interface**:
   - Add CRUD operations for the new entity in `server/storage.ts`
   - Implement these operations in the `DatabaseStorage` class

3. **Create API Routes**:
   - Add new endpoints in `server/routes.ts` for the Express implementation
   - Create appropriate NestJS modules for the NestJS implementation

4. **Create Frontend Components**:
   - Create form components for creating/editing entities
   - Create list/detail components for displaying entities
   - Update routing in `client/src/App.tsx`

### Authentication and Authorization

- Use the existing authentication middleware for protecting routes
- The `isAdmin` middleware protects admin-only routes
- Use session data to determine user identity and permissions

## Pull Request Process

1. Create a new branch for your feature or fix
2. Implement your changes following the guidelines above
3. Add tests for your changes if applicable
4. Update documentation to reflect your changes
5. Submit a pull request with a clear description of the changes

## Code Documentation

Follow these guidelines for code documentation:

- **JSDoc Comments**: Add JSDoc comments to document:
  - Functions and methods
  - React components and props
  - Classes and interfaces
  - Complex algorithms or logic

- **README Files**: Update relevant README files when adding new features

- **Examples**: Include examples of usage when documenting APIs or components

## Helpful Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)