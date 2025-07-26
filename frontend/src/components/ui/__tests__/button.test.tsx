import React from 'react';
import { screen } from '@testing-library/react';
import { Button } from '../button';
import { renderWithProviders } from '@/utils/test-utils';

describe('Button', () => {
  it('renders correctly with default props', () => {
    renderWithProviders(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('renders as a different variant', () => {
    renderWithProviders(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-destructive');
  });

  it('renders with different sizes', () => {
    renderWithProviders(<Button size="sm">Small</Button>);
    
    const button = screen.getByRole('button', { name: /small/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-8');
  });

  it('renders as a Slot when asChild is true', () => {
    renderWithProviders(
      <Button asChild>
        <a href="https://example.com">Link Button</a>
      </Button>
    );
    
    const linkButton = screen.getByRole('link', { name: /link button/i });
    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute('href', 'https://example.com');
    expect(linkButton).toHaveClass('bg-primary');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const { user } = renderWithProviders(
      <Button onClick={handleClick}>Click me</Button>
    );
    
    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    renderWithProviders(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });
});
