# Restaurant Management System

A full-featured restaurant management and review platform enabling administrators to manage restaurant listings and users to explore and rate dining experiences.

## Architecture Overview

This application is built with a modern tech stack:

- **Frontend**: React with TypeScript, using Wouter for routing and React Query for data fetching
- **Backend**: Hybrid Express/NestJS server transitioning to a full NestJS architecture
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication with Passport.js

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/              
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and types
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main application component with routing
│   │   └── main.tsx      # Entry point
├── server/               # Backend server
│   ├── modules/          # NestJS modules
│   │   ├── auth/         # Authentication
│   │   ├── database/     # Database connections and services
│   │   ├── restaurants/  # Restaurant endpoints
│   │   ├── menu-items/   # Menu item endpoints
│   │   └── reviews/      # Review endpoints
│   ├── routes.ts         # Express routes (legacy)
│   ├── storage.ts        # Storage interface and implementation
│   └── index.ts          # Server entry point
└── shared/               # Shared code between client and server
    └── schema.ts         # Database schema and type definitions
```

## Data Model

The application uses four main entities:

1. **Users** - Administrators and regular users who can write reviews
2. **Restaurants** - Restaurant listings with details
3. **Menu Items** - Food items belonging to restaurants
4. **Reviews** - User reviews for restaurants with ratings

## Features

### Public Features

- Browse restaurant listings
- View restaurant details including menu items
- Read reviews left by users
- User login/authentication

### Admin Features

- Create, edit, and delete restaurant listings
- Manage menu items for each restaurant
- View all reviews

### User Features

- Write, edit, and delete their own reviews
- Rate restaurants with star ratings

## API Endpoints

### Authentication

- `POST /api/login` - Authenticate a user
- `POST /api/logout` - Log out the current user
- `GET /api/users/current-user` - Get the currently logged-in user

### Restaurants

- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get a specific restaurant
- `POST /api/restaurants` - Create a new restaurant (admin only)
- `PATCH /api/restaurants/:id` - Update a restaurant (admin only)
- `DELETE /api/restaurants/:id` - Delete a restaurant (admin only)

### Menu Items

- `GET /api/menu-items` - Get all menu items
- `GET /api/menu-items?restaurantId=X` - Get menu items for a specific restaurant
- `GET /api/menu-items/:id` - Get a specific menu item
- `POST /api/menu-items` - Create a new menu item (admin only)
- `PATCH /api/menu-items/:id` - Update a menu item (admin only)
- `DELETE /api/menu-items/:id` - Delete a menu item (admin only)

### Reviews

- `GET /api/reviews` - Get all reviews
- `GET /api/reviews?restaurantId=X` - Get reviews for a specific restaurant
- `GET /api/reviews?userId=X` - Get reviews by a specific user
- `GET /api/reviews/:id` - Get a specific review
- `POST /api/reviews` - Create a new review (authenticated users only)
- `PATCH /api/reviews/:id` - Update a review (review owner only)
- `DELETE /api/reviews/:id` - Delete a review (review owner only)

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Apply database schema changes:
   ```bash
   npm run db:push
   ```

## Authentication

The system uses session-based authentication with Passport.js. Default credentials:

- Username: admin
- Password: admin123

## Dependencies

- React & React DOM
- Wouter (routing)
- TanStack React Query (data fetching)
- shadcn/ui (UI components)
- Tailwind CSS (styling)
- Drizzle ORM (database)
- NestJS (backend framework)
- Express.js (backend server)
- PostgreSQL (database)