/**
 * API Client Configuration
 * 
 * This module provides utilities for making API requests and configuring
 * TanStack Query (React Query) for data fetching throughout the application.
 */

import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Helper function to handle unsuccessful HTTP responses
 * Throws an error with status code and response text for better debugging
 * 
 * @param res - The fetch Response object to check
 * @throws Error with status code and response text if response is not ok
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * Main API request function used throughout the application
 * Supports both parameter orders for backward compatibility:
 * - New style: apiRequest<User>('/api/users', 'POST', data)
 * - Old style: apiRequest<User>('POST', '/api/users', data)
 * 
 * @param urlOrMethod - Either the URL (new style) or HTTP method (old style)
 * @param methodOrUrl - Either the HTTP method (new style) or URL (old style)
 * @param data - Optional data to send in the request body
 * @returns Promise resolving to the parsed response of type T
 */
export async function apiRequest<T = Response>(
  urlOrMethod: string,
  methodOrUrl?: string,
  data?: unknown | undefined,
): Promise<T> {
  // Handle both parameter orders to maintain backward compatibility
  let method: string;
  let url: string;
  
  if (urlOrMethod.startsWith('/')) {
    // First param is URL (new style)
    url = urlOrMethod;
    method = methodOrUrl || "GET";
  } else {
    // First param is method (old style)
    method = urlOrMethod;
    url = methodOrUrl || "";
  }

  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Include cookies for authentication
  });

  await throwIfResNotOk(res);
  
  // For DELETE requests or when no response is expected
  if (method === "DELETE" || res.headers.get("content-length") === "0") {
    return res as unknown as T;
  }
  
  return await res.json() as T;
}

/**
 * Type definition for how to handle 401 Unauthorized responses
 * - "returnNull": Silently return null (useful for conditional UI rendering)
 * - "throw": Throw an error (useful for redirecting to login)
 */
type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Factory function that creates a query function for React Query
 * Handles authentication status and provides type safety
 * 
 * @param options - Configuration options for the query function
 * @param options.on401 - How to handle 401 Unauthorized responses
 * @returns A query function for use with useQuery hooks
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Use the first item in the query key as the URL
    const res = await fetch(queryKey[0] as string, {
      credentials: "include", // Include cookies for authentication
    });

    // Handle unauthorized responses based on the specified behavior
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

/**
 * React Query client instance with global configuration
 * This is used throughout the application for data fetching
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }), // Default to throwing on 401
      refetchInterval: false, // Disable automatic refetching
      refetchOnWindowFocus: false, // Disable refetching when window regains focus
      staleTime: Infinity, // Data never becomes stale automatically
      retry: false, // Don't retry failed requests automatically
    },
    mutations: {
      retry: false, // Don't retry failed mutations automatically
    },
  },
});
