/**
 * ReviewForm Component Tests
 * 
 * This file contains tests for the ReviewForm component, verifying
 * its rendering, interaction behaviors, and form submission.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReviewForm } from './review-form';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the apiRequest function
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn().mockResolvedValue({}),
  queryClient: new QueryClient(),
}));

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('ReviewForm Component', () => {
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

  // Test that the form renders correctly in create mode
  it('renders the form in create mode', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ReviewForm restaurantId={1} userId={1} />
      </QueryClientProvider>
    );

    // Check that the title is correct
    expect(screen.getByText('Write a Review')).toBeInTheDocument();
    
    // Check for form elements
    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Share your experience at this restaurant...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Review' })).toBeInTheDocument();
  });

  // Test that the form renders correctly in edit mode
  it('renders the form in edit mode', () => {
    const review = {
      id: 1,
      restaurantId: 1,
      userId: 1,
      rating: 4,
      content: 'Existing review content',
      createdAt: '2023-01-01T00:00:00.000Z',
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ReviewForm restaurantId={1} userId={1} review={review} />
      </QueryClientProvider>
    );

    // Check that the title is correct
    expect(screen.getByText('Edit Review')).toBeInTheDocument();
    
    // Check that the form has the review content
    const textareaElement = screen.getByPlaceholderText('Share your experience at this restaurant...');
    expect(textareaElement).toHaveValue('Existing review content');
    
    // Check that the submit button has the correct text
    expect(screen.getByRole('button', { name: 'Update Review' })).toBeInTheDocument();
  });

  // Test form validation
  it('displays validation errors for invalid inputs', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ReviewForm restaurantId={1} userId={1} />
      </QueryClientProvider>
    );

    // Submit without filling in any fields
    fireEvent.click(screen.getByRole('button', { name: 'Submit Review' }));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Rating is required')).toBeInTheDocument();
    });

    // Enter a short review
    fireEvent.change(screen.getByPlaceholderText('Share your experience at this restaurant...'), {
      target: { value: 'Too short' },
    });

    // Submit again
    fireEvent.click(screen.getByRole('button', { name: 'Submit Review' }));

    // Check for the short content validation error
    await waitFor(() => {
      expect(screen.getByText('Review content must be at least 10 characters')).toBeInTheDocument();
    });
  });
});