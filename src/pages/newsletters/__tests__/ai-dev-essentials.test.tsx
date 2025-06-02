import React from 'react'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import AIDevEssentialsPage from '../ai-dev-essentials'
import {Post} from '@/pages/[post]'

// Mock Next.js components
jest.mock('next/image', () => {
  return function MockImage({src, alt, ...props}: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

jest.mock('next/link', () => {
  return function MockLink({href, children, ...props}: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

jest.mock('next-seo', () => ({
  NextSeo: ({children, ...props}: any) => (
    <div data-testid="next-seo" {...props}>
      {children}
    </div>
  ),
}))

// Mock console.log to capture logging
const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

describe('AIDevEssentialsPage', () => {
  const mockPosts: Post[] = [
    {
      id: 'post-1',
      type: 'post',
      createdById: 'user-1',
      fields: {
        title: 'AI Dev Essentials: Getting Started with Machine Learning',
        postType: 'lesson',
        summary: 'Learn the basics of ML for developers',
        body: 'Content here',
        state: 'published',
        visibility: 'public',
        access: 'free',
        slug: 'ai-dev-essentials-ml-basics',
        description: 'A comprehensive guide to ML basics',
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      deletedAt: null,
      name: 'John Doe',
      image: 'https://example.com/avatar1.jpg',
    },
    {
      id: 'post-2',
      type: 'post',
      createdById: 'user-2',
      fields: {
        title: 'AI Dev Essentials: Advanced Neural Networks',
        postType: 'lesson',
        summary: 'Deep dive into neural networks',
        body: 'Advanced content',
        state: 'published',
        visibility: 'public',
        access: 'pro',
        slug: 'ai-dev-essentials-neural-networks',
        description: 'Advanced neural network concepts',
      },
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      deletedAt: null,
      name: 'Jane Smith',
      image: 'https://example.com/avatar2.jpg',
    },
  ]

  beforeEach(() => {
    consoleSpy.mockClear()
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  it('renders hero section correctly', () => {
    render(<AIDevEssentialsPage posts={mockPosts} />)

    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent(
      'AI Dev Essentials',
    )
    expect(
      screen.getByText(/Master the latest AI development tools/),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Join thousands of developers staying ahead/),
    ).toBeInTheDocument()
  })

  it('displays list of posts correctly', () => {
    render(<AIDevEssentialsPage posts={mockPosts} />)

    expect(
      screen.getByText(
        'AI Dev Essentials: Getting Started with Machine Learning',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText('AI Dev Essentials: Advanced Neural Networks'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Learn the basics of ML for developers'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Deep dive into neural networks'),
    ).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('shows newsletter signup form', () => {
    render(<AIDevEssentialsPage posts={mockPosts} />)

    const emailInputs = screen.getAllByPlaceholderText('Enter your email')
    const subscribeButtons = screen.getAllByText('Subscribe')

    expect(emailInputs).toHaveLength(2) // One in hero, one in CTA section
    expect(subscribeButtons).toHaveLength(2)
  })

  it('handles newsletter form submission', async () => {
    render(<AIDevEssentialsPage posts={mockPosts} />)

    const emailInput = screen.getAllByPlaceholderText('Enter your email')[0]
    const subscribeButton = screen.getAllByText('Subscribe')[0]

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}})
    fireEvent.click(subscribeButton)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Thank you for subscribing! Check your email for confirmation.',
        ),
      ).toBeInTheDocument()
    })

    expect(emailInput).toHaveValue('')
  })

  it('handles loading states correctly', async () => {
    render(<AIDevEssentialsPage posts={mockPosts} />)

    const emailInput = screen.getAllByPlaceholderText('Enter your email')[0]
    const subscribeButton = screen.getAllByText('Subscribe')[0]

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}})
    fireEvent.click(subscribeButton)

    // Check for loading state
    expect(screen.getByText('Subscribing...')).toBeInTheDocument()

    await waitFor(() => {
      expect(
        screen.getByText(
          'Thank you for subscribing! Check your email for confirmation.',
        ),
      ).toBeInTheDocument()
    })
  })

  it('displays empty state when no posts are provided', () => {
    render(<AIDevEssentialsPage posts={[]} />)

    expect(
      screen.getByText(
        'No AI Dev Essentials posts found. Check back soon for new content!',
      ),
    ).toBeInTheDocument()
  })

  it('renders post cards with correct links', () => {
    render(<AIDevEssentialsPage posts={mockPosts} />)

    const readMoreLinks = screen.getAllByText('Read more')
    const titleLinks = screen.getAllByRole('link')

    expect(readMoreLinks).toHaveLength(2)

    // Check that links point to correct slugs
    const mlBasicsLinks = titleLinks.filter(
      (link) => link.getAttribute('href') === '/ai-dev-essentials-ml-basics',
    )
    const neuralNetworksLinks = titleLinks.filter(
      (link) =>
        link.getAttribute('href') === '/ai-dev-essentials-neural-networks',
    )

    expect(mlBasicsLinks.length).toBeGreaterThan(0)
    expect(neuralNetworksLinks.length).toBeGreaterThan(0)
  })

  it('displays formatted dates correctly', () => {
    render(<AIDevEssentialsPage posts={mockPosts} />)

    expect(screen.getByText('January 1, 2024')).toBeInTheDocument()
    expect(screen.getByText('January 2, 2024')).toBeInTheDocument()
  })

  it('shows author images when available', () => {
    render(<AIDevEssentialsPage posts={mockPosts} />)

    const authorImages = screen.getAllByRole('img')
    const johnDoeImage = authorImages.find(
      (img) => img.getAttribute('alt') === 'John Doe',
    )
    const janeSmithImage = authorImages.find(
      (img) => img.getAttribute('alt') === 'Jane Smith',
    )

    expect(johnDoeImage).toBeInTheDocument()
    expect(janeSmithImage).toBeInTheDocument()
    expect(johnDoeImage?.getAttribute('src')).toBe(
      'https://example.com/avatar1.jpg',
    )
    expect(janeSmithImage?.getAttribute('src')).toBe(
      'https://example.com/avatar2.jpg',
    )
  })

  it('logs page render information', () => {
    render(<AIDevEssentialsPage posts={mockPosts} />)

    expect(consoleSpy).toHaveBeenCalledWith(
      'INFO: AI Dev Essentials page rendered with 2 posts loaded',
    )
  })

  it('validates email input requirement', () => {
    render(<AIDevEssentialsPage posts={mockPosts} />)

    const emailInput = screen.getAllByPlaceholderText('Enter your email')[0]
    expect(emailInput).toHaveAttribute('required')
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('renders SEO meta tags', () => {
    render(<AIDevEssentialsPage posts={mockPosts} />)

    const seoComponent = screen.getByTestId('next-seo')
    expect(seoComponent).toHaveAttribute(
      'title',
      'AI Dev Essentials Newsletter | egghead.io',
    )
    expect(seoComponent).toHaveAttribute(
      'description',
      'Stay up-to-date with the latest AI development tools, techniques, and best practices. Join thousands of developers learning AI essentials.',
    )
  })

  it('handles posts without images gracefully', () => {
    const postsWithoutImages: Post[] = [
      {
        ...mockPosts[0],
        image: undefined,
      },
    ]

    render(<AIDevEssentialsPage posts={postsWithoutImages} />)

    expect(
      screen.getByText(
        'AI Dev Essentials: Getting Started with Machine Learning',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('egghead')).toBeInTheDocument() // Fallback name
  })

  it('truncates long descriptions correctly', () => {
    const postWithLongDescription: Post[] = [
      {
        ...mockPosts[0],
        fields: {
          ...mockPosts[0].fields,
          summary:
            'This is a very long summary that should be truncated when displayed in the post card component because it exceeds the maximum length limit that we have set for the description text in the UI component.',
        },
      },
    ]

    render(<AIDevEssentialsPage posts={postWithLongDescription} />)

    const truncatedText = screen.getByText(
      /This is a very long summary that should be truncated/,
    )
    expect(truncatedText.textContent?.length).toBeLessThan(200) // Should be truncated
  })
})
