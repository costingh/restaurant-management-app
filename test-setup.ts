/**
 * Test Setup File
 * 
 * This file is imported by Vitest before running tests and sets up
 * global configurations that will be available to all test files.
 */

import { beforeAll, afterAll, afterEach, expect } from 'vitest';
import { setupServer } from 'msw/node';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with Testing Library's matchers
expect.extend(matchers);

// Clean up DOM after each test
afterEach(() => {
  cleanup();
});

// Set up MSW server if needed for API mocking
export const restHandlers = [];
export const server = setupServer(...restHandlers);

beforeAll(() => {
  // Start the MSW server before all tests
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  // Reset any request handlers between tests
  server.resetHandlers();
});

afterAll(() => {
  // Close the MSW server after all tests are complete
  server.close();
});