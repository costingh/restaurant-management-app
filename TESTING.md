# Testing Documentation

This document provides information about testing in the Restaurant Management System application.

## Testing Stack

- **Vitest**: A Vite-native test runner that provides fast test execution and a Jest-compatible API.
- **React Testing Library**: Utilities for testing React components in a user-centric way.
- **MSW (Mock Service Worker)**: API mocking library for intercepting network requests.
- **Happy-DOM**: A lightweight DOM/browser implementation for testing.

## Test Types

The application includes several types of tests:

1. **Unit Tests**: Test individual functions and components in isolation.
2. **Component Tests**: Test React components with their dependencies mocked.
3. **Integration Tests**: Test interactions between multiple components.
4. **API Mock Tests**: Test client-side API interactions with mocked server responses.

## Running Tests

### Test Script

We provide a convenient script to run tests:

```bash
# Run tests in watch mode (interactive)
./run-tests.sh

# Run tests once without watch mode
./run-tests.sh run

# Run tests with coverage report
./run-tests.sh coverage
```

### Using NPX Directly

Alternatively, you can run tests directly using npx:

```bash
# Run tests in watch mode
npx vitest

# Run tests once
npx vitest run

# Run tests with coverage
npx vitest run --coverage
```

## Test Structure

Tests are organized alongside the code they test:

- Component tests: Located in the same directory as the component, with a `.test.tsx` extension.
- Utility function tests: Located in the same directory as the utility, with a `.test.ts` extension.

## Writing New Tests

### Component Test Example

Here's an example of how to write a test for a React component:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './component-name';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    
    // Assert on rendered content
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('handles user interaction', () => {
    const handleClick = vi.fn();
    render(<ComponentName onClick={handleClick} />);
    
    // Simulate user interaction
    fireEvent.click(screen.getByRole('button'));
    
    // Assert on the result
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Testing Components with Context

For components that rely on context (e.g., React Query), you need to provide the context:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Wrap component with context providers
render(
  <QueryClientProvider client={queryClient}>
    <ComponentWithQuery />
  </QueryClientProvider>
);
```

### Mocking API Requests

For tests that involve API requests, use MSW to mock server responses:

```typescript
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Set up MSW server
const server = setupServer(
  http.get('/api/endpoint', () => {
    return HttpResponse.json({ data: 'mocked response' });
  })
);

// Start server before tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());
```

### Testing Form Submissions

When testing forms, you'll need to fill in form fields and submit the form:

```typescript
// Fill in a text field
fireEvent.change(screen.getByLabelText('Username'), {
  target: { value: 'testuser' }
});

// Submit the form
fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

// Assert that the submission handler was called
expect(mockSubmitFn).toHaveBeenCalledWith(
  expect.objectContaining({
    username: 'testuser'
  })
);
```

## Best Testing Practices

1. **User-Centric Testing**: Test from the user's perspective, focusing on what the user sees and interacts with rather than implementation details.

2. **Isolation**: Each test should be isolated from others to avoid interdependencies.

3. **Minimal Mocking**: Mock only what's necessary. Prefer testing actual component integrations when possible.

4. **Clear Assertions**: Write clear assertions that express what you're trying to test.

5. **Coverage**: Aim for good test coverage, especially for critical business logic.

6. **Test Organization**: Structure tests logically, grouping related tests together with `describe` blocks.

7. **Avoid Testing Implementation Details**: Focus on behavior, not implementation. This makes tests more resilient to code changes.

## Test Troubleshooting

### Common Issues

1. **Tests Timing Out**: 
   - Use `waitFor` or `findByText` for asynchronous operations.
   - Check that promises are properly resolved in your code.

2. **Element Not Found**: 
   - Check the component's render output.
   - Ensure queries are matching the correct text/role.
   - Use `screen.debug()` to see the current DOM state.

3. **Mock Not Being Called**: 
   - Verify the mocked function is properly set up.
   - Check that the right module is being mocked.

4. **Context Issues**: 
   - Ensure all necessary context providers are in place.
   - Check for missing QueryClient, AuthProvider, etc.

### Debugging Tests

Add `console.log` statements or use the `screen.debug()` utility to inspect the component's render output:

```typescript
import { screen } from '@testing-library/react';

test('component rendering', () => {
  render(<MyComponent />);
  
  // Print the current state of the DOM to the console
  screen.debug();
  
  // Continue with test...
});
```

## Test Coverage Report

To generate a test coverage report:

```bash
./run-tests.sh coverage
```

This will create a detailed report showing which parts of the codebase are covered by tests. The report will be available in the `coverage` directory.