import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';

// Add in any providers here if needed
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  mocks?: MockedResponse[];
  theme?: 'dark' | 'light';
}

/**
 * Custom render function that wraps components with necessary providers
 * @param ui - The React component to render
 * @param options - Custom render options including Apollo mocks and theme
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    mocks = [],
    theme = 'light',
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <MockedProvider mocks={mocks} addTypename={false}>
        <ThemeProvider defaultTheme={theme} enableSystem={false} attribute="class" forcedTheme={theme}>
          {children}
        </ThemeProvider>
      </MockedProvider>
    );
  };

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';
