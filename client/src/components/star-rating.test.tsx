/**
 * StarRating Component Tests
 * 
 * This file contains tests for the StarRating component, testing
 * both its appearance and interactive behaviors.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarRating } from './star-rating';

describe('StarRating Component', () => {
  // Test initial rendering with different ratings
  it('renders with the correct number of filled stars', () => {
    const setRating = vi.fn();
    
    // Render with rating of 3
    const { rerender } = render(<StarRating rating={3} setRating={setRating} />);
    
    // Get all star elements
    const stars = screen.getAllByTestId('star-icon');
    expect(stars).toHaveLength(5);
    
    // Check that the first 3 stars have the filled class
    expect(stars[0]).toHaveClass('fill-yellow-400');
    expect(stars[1]).toHaveClass('fill-yellow-400');
    expect(stars[2]).toHaveClass('fill-yellow-400');
    
    // Check that the last 2 stars don't have the filled class
    expect(stars[3]).not.toHaveClass('fill-yellow-400');
    expect(stars[4]).not.toHaveClass('fill-yellow-400');
    
    // Rerender with rating of 5
    rerender(<StarRating rating={5} setRating={setRating} />);
    
    // Check that all stars have the filled class
    const updatedStars = screen.getAllByTestId('star-icon');
    updatedStars.forEach(star => {
      expect(star).toHaveClass('fill-yellow-400');
    });
  });

  // Test click behavior
  it('calls setRating when a star is clicked', () => {
    const setRating = vi.fn();
    render(<StarRating rating={0} setRating={setRating} />);
    
    // Click the third star
    const stars = screen.getAllByTestId('star-icon');
    fireEvent.click(stars[2]);
    
    // Check that setRating was called with 3
    expect(setRating).toHaveBeenCalledWith(3);
  });

  // Test toggling behavior (clicking the same star twice)
  it('toggles the rating when clicking the same star twice', () => {
    const setRating = vi.fn();
    render(<StarRating rating={3} setRating={setRating} />);
    
    // Click the third star (which is already selected)
    const stars = screen.getAllByTestId('star-icon');
    fireEvent.click(stars[2]);
    
    // Check that setRating was called with 0 (to clear the rating)
    expect(setRating).toHaveBeenCalledWith(0);
  });

  // Test readonly mode
  it('does not call setRating when in readonly mode', () => {
    const setRating = vi.fn();
    render(<StarRating rating={3} setRating={setRating} readonly={true} />);
    
    // Click the third star
    const stars = screen.getAllByTestId('star-icon');
    fireEvent.click(stars[2]);
    
    // Check that setRating was not called
    expect(setRating).not.toHaveBeenCalled();
  });

  // Test hover behavior
  it('changes star appearance on hover', () => {
    const setRating = vi.fn();
    render(<StarRating rating={0} setRating={setRating} />);
    
    // Get all star elements
    const stars = screen.getAllByTestId('star-icon');
    
    // Hover over the third star
    fireEvent.mouseEnter(stars[2]);
    
    // Check that the first 3 stars have the filled class
    expect(stars[0]).toHaveClass('fill-yellow-400');
    expect(stars[1]).toHaveClass('fill-yellow-400');
    expect(stars[2]).toHaveClass('fill-yellow-400');
    
    // Check that the last 2 stars don't have the filled class
    expect(stars[3]).not.toHaveClass('fill-yellow-400');
    expect(stars[4]).not.toHaveClass('fill-yellow-400');
    
    // Mouse leave should reset hover state
    fireEvent.mouseLeave(stars[2]);
    
    // Since the rating is 0, no stars should be filled
    expect(stars[0]).not.toHaveClass('fill-yellow-400');
    expect(stars[1]).not.toHaveClass('fill-yellow-400');
    expect(stars[2]).not.toHaveClass('fill-yellow-400');
    expect(stars[3]).not.toHaveClass('fill-yellow-400');
    expect(stars[4]).not.toHaveClass('fill-yellow-400');
  });

  // Test custom size prop
  it('applies the correct size to star icons', () => {
    const setRating = vi.fn();
    render(<StarRating rating={3} setRating={setRating} size={40} />);
    
    // Get all star elements
    const stars = screen.getAllByTestId('star-icon');
    
    // Check that each star has the correct size attribute
    stars.forEach(star => {
      expect(star).toHaveAttribute('width', '40');
      expect(star).toHaveAttribute('height', '40');
    });
  });
});