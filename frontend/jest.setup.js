// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom');

// Mock window.matchMedia - required for next-themes
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: function Image(props) {
      // Create img element without JSX
      return React.createElement('img', {
        ...props,
        // Remove next/image specific props
        loader: undefined,
        loading: undefined,
        placeholder: undefined,
        blurDataURL: undefined,
      });
    },
  };
});

// Suppress console errors during tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      /Warning: ReactDOM.render is no longer supported in React 18/.test(args[0]) ||
      /Warning: useLayoutEffect does nothing on the server/.test(args[0]) ||
      /`ReactDOMTestUtils.act` is deprecated/.test(args[0])
    ) {
      return;
    }
    originalConsoleError(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});
