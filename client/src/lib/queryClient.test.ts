/**
 * API Client Tests
 * 
 * This file contains tests for the API client functions, verifying that
 * they correctly interact with the backend API.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiRequest, queryClient } from './queryClient';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Set up API mocking server
const server = setupServer(
  // Mock GET endpoint
  http.get('/api/test', () => {
    return HttpResponse.json({ message: 'Test GET response' });
  }),
  
  // Mock POST endpoint
  http.post('/api/test', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ 
      message: 'Test POST response',
      receivedData: body
    });
  }),
  
  // Mock error response
  http.get('/api/error', () => {
    return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
  })
);

// Start server before all tests
beforeEach(() => {
  // Only call listen once in the entire test suite
  if (!server.listenerCount('request')) {
    server.listen();
  }
});

// Reset any request handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());

describe('API Client Functions', () => {
  describe('apiRequest function', () => {
    it('should make a GET request (new style parameter order)', async () => {
      const response = await apiRequest('/api/test');
      expect(response).toEqual({ message: 'Test GET response' });
    });
    
    it('should make a GET request (old style parameter order)', async () => {
      const response = await apiRequest('GET', '/api/test');
      expect(response).toEqual({ message: 'Test GET response' });
    });
    
    it('should make a POST request with data', async () => {
      const testData = { key: 'value' };
      const response = await apiRequest('/api/test', 'POST', testData);
      expect(response).toEqual({
        message: 'Test POST response',
        receivedData: testData
      });
    });
    
    it('should throw an error for failed requests', async () => {
      await expect(apiRequest('/api/error')).rejects.toThrow('500');
    });
  });
  
  describe('queryClient', () => {
    it('should have default options set', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      
      // Check query options
      expect(defaultOptions.queries?.staleTime).toBe(Infinity);
      expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
      expect(defaultOptions.queries?.retry).toBe(false);
      
      // Check mutation options
      expect(defaultOptions.mutations?.retry).toBe(false);
    });
  });
});