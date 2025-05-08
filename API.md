# API Documentation

This document provides detailed information about the REST API endpoints available in the Restaurant Management System.

## Base URL

All API routes are prefixed with `/api`.

## Authentication

Most endpoints require authentication. Authentication is session-based and can be established by using the login endpoint.

### Authentication Endpoints

#### Login

```
POST /api/login
```

Authenticates a user and establishes a session.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "username": "string",
  "isAdmin": "boolean"
}
```

**Status Codes:**
- 200: Success
- 401: Invalid credentials

#### Logout

```
POST /api/logout
```

Ends the current user session.

**Response:**
```
No content
```

**Status Codes:**
- 200: Success

#### Get Current User

```
GET /api/current-user
```

Returns information about the currently authenticated user.

**Response:**
```json
{
  "id": "number",
  "username": "string",
  "isAdmin": "boolean"
}
```

**Status Codes:**
- 200: Success
- 401: Not authenticated

---

## Restaurant Endpoints

### Get All Restaurants

```
GET /api/restaurants
```

Returns a list of all restaurants.

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "cuisine": "string",
    "location": "string",
    "phone": "string",
    "openingHours": "string",
    "description": "string (optional)",
    "imageUrl": "string (optional)"
  }
]
```

**Status Codes:**
- 200: Success

### Get Restaurant by ID

```
GET /api/restaurants/:id
```

Returns details of a specific restaurant.

**Path Parameters:**
- id: Restaurant ID

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "cuisine": "string",
  "location": "string",
  "phone": "string",
  "openingHours": "string",
  "description": "string (optional)",
  "imageUrl": "string (optional)"
}
```

**Status Codes:**
- 200: Success
- 404: Restaurant not found

### Create Restaurant

```
POST /api/restaurants
```

Creates a new restaurant (Admin only).

**Request Body:**
```json
{
  "name": "string",
  "cuisine": "string",
  "location": "string",
  "phone": "string",
  "openingHours": "string",
  "description": "string (optional)",
  "imageUrl": "string (optional)"
}
```

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "cuisine": "string",
  "location": "string",
  "phone": "string",
  "openingHours": "string",
  "description": "string (optional)",
  "imageUrl": "string (optional)"
}
```

**Status Codes:**
- 201: Created
- 401: Not authenticated
- 403: Not authorized (not admin)
- 400: Validation error

### Update Restaurant

```
PATCH /api/restaurants/:id
```

Updates an existing restaurant (Admin only).

**Path Parameters:**
- id: Restaurant ID

**Request Body:**
```json
{
  "name": "string (optional)",
  "cuisine": "string (optional)",
  "location": "string (optional)",
  "phone": "string (optional)",
  "openingHours": "string (optional)",
  "description": "string (optional)",
  "imageUrl": "string (optional)"
}
```

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "cuisine": "string",
  "location": "string",
  "phone": "string",
  "openingHours": "string",
  "description": "string (optional)",
  "imageUrl": "string (optional)"
}
```

**Status Codes:**
- 200: Success
- 401: Not authenticated
- 403: Not authorized (not admin)
- 404: Restaurant not found
- 400: Validation error

### Delete Restaurant

```
DELETE /api/restaurants/:id
```

Deletes a restaurant and its associated menu items and reviews (Admin only).

**Path Parameters:**
- id: Restaurant ID

**Response:**
```
No content
```

**Status Codes:**
- 204: Success (No Content)
- 401: Not authenticated
- 403: Not authorized (not admin)
- 404: Restaurant not found

---

## Menu Item Endpoints

### Get All Menu Items

```
GET /api/menu-items
```

Returns all menu items. Can be filtered by restaurant ID.

**Query Parameters:**
- restaurantId (optional): Filter by restaurant ID

**Response:**
```json
[
  {
    "id": "number",
    "restaurantId": "number",
    "name": "string",
    "description": "string (optional)",
    "price": "string",
    "category": "string",
    "imageUrl": "string (optional)"
  }
]
```

**Status Codes:**
- 200: Success

### Get Menu Item by ID

```
GET /api/menu-items/:id
```

Returns details of a specific menu item.

**Path Parameters:**
- id: Menu Item ID

**Response:**
```json
{
  "id": "number",
  "restaurantId": "number",
  "name": "string",
  "description": "string (optional)",
  "price": "string",
  "category": "string",
  "imageUrl": "string (optional)"
}
```

**Status Codes:**
- 200: Success
- 404: Menu item not found

### Create Menu Item

```
POST /api/menu-items
```

Creates a new menu item (Admin only).

**Request Body:**
```json
{
  "restaurantId": "number",
  "name": "string",
  "description": "string (optional)",
  "price": "string",
  "category": "string",
  "imageUrl": "string (optional)"
}
```

**Response:**
```json
{
  "id": "number",
  "restaurantId": "number",
  "name": "string",
  "description": "string (optional)",
  "price": "string",
  "category": "string",
  "imageUrl": "string (optional)"
}
```

**Status Codes:**
- 201: Created
- 401: Not authenticated
- 403: Not authorized (not admin)
- 400: Validation error

### Update Menu Item

```
PATCH /api/menu-items/:id
```

Updates an existing menu item (Admin only).

**Path Parameters:**
- id: Menu Item ID

**Request Body:**
```json
{
  "restaurantId": "number (optional)",
  "name": "string (optional)",
  "description": "string (optional)",
  "price": "string (optional)",
  "category": "string (optional)",
  "imageUrl": "string (optional)"
}
```

**Response:**
```json
{
  "id": "number",
  "restaurantId": "number",
  "name": "string",
  "description": "string (optional)",
  "price": "string",
  "category": "string",
  "imageUrl": "string (optional)"
}
```

**Status Codes:**
- 200: Success
- 401: Not authenticated
- 403: Not authorized (not admin)
- 404: Menu item not found
- 400: Validation error

### Delete Menu Item

```
DELETE /api/menu-items/:id
```

Deletes a menu item (Admin only).

**Path Parameters:**
- id: Menu Item ID

**Response:**
```
No content
```

**Status Codes:**
- 204: Success (No Content)
- 401: Not authenticated
- 403: Not authorized (not admin)
- 404: Menu item not found

---

## Review Endpoints

### Get All Reviews

```
GET /api/reviews
```

Returns all reviews. Can be filtered by restaurant ID or user ID.

**Query Parameters:**
- restaurantId (optional): Filter by restaurant ID
- userId (optional): Filter by user ID

**Response:**
```json
[
  {
    "id": "number",
    "restaurantId": "number",
    "userId": "number",
    "rating": "number",
    "content": "string",
    "createdAt": "string (ISO date)"
  }
]
```

**Status Codes:**
- 200: Success

### Get Review by ID

```
GET /api/reviews/:id
```

Returns details of a specific review.

**Path Parameters:**
- id: Review ID

**Response:**
```json
{
  "id": "number",
  "restaurantId": "number",
  "userId": "number",
  "rating": "number",
  "content": "string",
  "createdAt": "string (ISO date)"
}
```

**Status Codes:**
- 200: Success
- 404: Review not found

### Create Review

```
POST /api/reviews
```

Creates a new review (Authenticated users only).

**Request Body:**
```json
{
  "restaurantId": "number",
  "userId": "number",
  "rating": "number (1-5)",
  "content": "string (min: 10, max: 500 characters)"
}
```

**Response:**
```json
{
  "id": "number",
  "restaurantId": "number",
  "userId": "number",
  "rating": "number",
  "content": "string",
  "createdAt": "string (ISO date)"
}
```

**Status Codes:**
- 201: Created
- 401: Not authenticated
- 400: Validation error

### Update Review

```
PATCH /api/reviews/:id
```

Updates an existing review (Review owner only).

**Path Parameters:**
- id: Review ID

**Request Body:**
```json
{
  "rating": "number (optional, 1-5)",
  "content": "string (optional, min: 10, max: 500 characters)"
}
```

**Response:**
```json
{
  "id": "number",
  "restaurantId": "number",
  "userId": "number",
  "rating": "number",
  "content": "string",
  "createdAt": "string (ISO date)"
}
```

**Status Codes:**
- 200: Success
- 401: Not authenticated
- 403: Not authorized (not review owner)
- 404: Review not found
- 400: Validation error

### Delete Review

```
DELETE /api/reviews/:id
```

Deletes a review (Review owner or admin only).

**Path Parameters:**
- id: Review ID

**Response:**
```
No content
```

**Status Codes:**
- 204: Success (No Content)
- 401: Not authenticated
- 403: Not authorized (not review owner or admin)
- 404: Review not found

---

## Users Endpoints

### Get All Users

```
GET /api/users
```

Returns a list of all users.

**Response:**
```json
[
  {
    "id": "number",
    "username": "string",
    "isAdmin": "boolean"
  }
]
```

**Status Codes:**
- 200: Success

Note: This endpoint does not return password information.

### Get User by ID

```
GET /api/users/:id
```

Returns details of a specific user.

**Path Parameters:**
- id: User ID

**Response:**
```json
{
  "id": "number",
  "username": "string",
  "isAdmin": "boolean"
}
```

**Status Codes:**
- 200: Success
- 404: User not found

Note: This endpoint does not return password information.