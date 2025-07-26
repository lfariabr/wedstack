import React from 'react';
import { screen, within } from '@testing-library/react';
import HomePage from '../page';
import { renderWithProviders } from '@/utils/test-utils';

// Mock the featured projects/articles hooks
jest.mock('@/lib/hooks/useProjects', () => ({
  useFeaturedProjects: () => ({
    projects: [
      { id: '1', title: 'Featured Project 1', description: 'Project description', slug: 'project-1' },
      { id: '2', title: 'Featured Project 2', description: 'Project description', slug: 'project-2' },
    ],
    loading: false,
    error: null,
  }),
}));

jest.mock('@/lib/hooks/useArticles', () => ({
  useFeaturedArticles: () => ({
    articles: [
      { id: '1', title: 'Featured Article 1', summary: 'Article summary', slug: 'article-1' },
      { id: '2', title: 'Featured Article 2', summary: 'Article summary', slug: 'article-2' },
    ],
    loading: false,
    error: null,
  }),
}));

describe('Home Page', () => {
  it('renders the hero section', () => {
    renderWithProviders(<HomePage />);
    
    // Check for hero heading
    const heroHeading = screen.getByRole('heading', { level: 1 });
    expect(heroHeading).toBeInTheDocument();
    expect(heroHeading).toHaveTextContent('Luis Faria');
  });

  it('renders projects section', () => {
    renderWithProviders(<HomePage />);
    
    // Check for projects section
    const projectsHeading = screen.getAllByRole('heading', { name: /projects/i })[0];
    expect(projectsHeading).toBeInTheDocument();
  });

  it('renders articles section', () => {
    renderWithProviders(<HomePage />);
    
    // Check for articles section
    const articlesHeading = screen.getAllByRole('heading', { name: /articles/i })[0];
    expect(articlesHeading).toBeInTheDocument();
  });

  it('has navigation links in the header', () => {
    renderWithProviders(<HomePage />);
    
    // Find the navigation element first, then find links within it
    const navigation = screen.getByRole('navigation');
    
    // Find links within the navigation
    const projectsLink = within(navigation).getByText(/projects/i);
    const articlesLink = within(navigation).getByText(/articles/i);
    const chatbotLink = within(navigation).getByText(/chatbot/i);
    
    // Check that links have correct hrefs
    expect(projectsLink).toHaveAttribute('href', '/projects');
    expect(articlesLink).toHaveAttribute('href', '/articles');
    expect(chatbotLink).toHaveAttribute('href', '/chatbot');
  });
});
