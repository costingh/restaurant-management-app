/**
 * Restaurant Details Page Integration Tests
 * 
 * This file tests the complete restaurant details page, including
 * the interaction between different components like reviews and menu items.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RestaurantDetails from './restaurant-details';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock the wouter router hooks
vi.mock('wouter', () => {
  return {
    useRoute: () => [true, { id: '1' }],
    useLocation: () => ['/restaurants/1', vi.fn()],
  };
});

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Set up MSW API mocking server
const server = setupServer(
  // Mock restaurant details
  http.get('/api/restaurants/1', () => {
    return HttpResponse.json({
      id: 1,
      name: 'Test Restaurant',
      cuisine: 'Test Cuisine',
      location: '123 Test St',
      phone: '123-456-7890',
      openingHours: 'Mon-Fri: 9AM-9PM',
      description: 'A test restaurant',
    });
  }),
  
  // Mock menu items
  http.get('/api/menu-items', ({ request }) => {
    const url = new URL(request.url);
    const restaurantId = url.searchParams.get('restaurantId');
    
    if (restaurantId === '1') {
      return HttpResponse.json([
        {
          id: 1,
          restaurantId: 1,
          name: 'Test Item 1',
          price: '$10.99',
          category: 'Appetizers',
          description: 'A test menu item'
        },
        {
          id: 2,
          restaurantId: 1,
          name: 'Test Item 2',
          price: '$15.99',
          category: 'Main Course',
          description: 'Another test menu item'
        }
      ]);
    }
    
    return HttpResponse.json([]);
  }),
  
  // Mock reviews
  http.get('/api/reviews', () => {
    return HttpResponse.json([
      {
        id: 1,
        restaurantId: 1,
        userId: 1,
        rating: 4,
        content: 'Test review content',
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ]);
  }),
  
  // Mock current user
  http.get('/api/users/current-user', () => {
    return HttpResponse.json({
      id: 1,
      username: 'testuser',
      isAdmin: false
    });
  }),
  
  // Mock users endpoint
  http.get('/api/users', () => {
    return HttpResponse.json([
      {
        id: 1,
        username: 'testuser',
        isAdmin: false
      }
    ]);
  })
);

beforeEach(() => server.listen());
afterEach(() => server.resetHandlers());
afterEach(() => server.close());

describe('Restaurant Details Page', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  it('renders restaurant details, menu items, and reviews', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RestaurantDetails />
      </QueryClientProvider>
    );

    // Wait for the restaurant name to appear
    await waitFor(() => {
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    });

    // Check for restaurant details
    expect(screen.getByText('Test Cuisine')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('Mon-Fri: 9AM-9PM')).toBeInTheDocument();
    expect(screen.getByText('A test restaurant')).toBeInTheDocument();
    
    // Check for menu items
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });
    expect(screen.getByText('$10.99')).toBeInTheDocument();
    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    expect(screen.getByText('$15.99')).toBeInTheDocument();
    
    // Check for reviews
    await waitFor(() => {
      expect(screen.getByText('Test review content')).toBeInTheDocument();
    });
  });
});