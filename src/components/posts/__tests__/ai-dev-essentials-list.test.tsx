import React from 'react'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import {useRouter} from 'next/router'
import AIDevEssentialsList from '../ai-dev-essentials-list'
import {Post} from '@/pages/[post]'

// Mock Next.js components and hooks
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

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

const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

// Mock console.log to capture logging
const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

describe('AIDevEssentialsList', () => {
  const mockPosts: Post[] = Array.from({length: 15}, (_, i) => ({
    id: `post-${i + 1}`,
    type: 'post',
    createdById: `user-${i + 1}`,
    fields: {
      title: `AI Dev Essentials: Post ${i + 1}`,
      postType: 'lesson',
      summary: `Summary for post ${i + 1}`,
      body: `Content for post ${i + 1}`,
      state: 'published',
      visibility: 'public',
      access: i % 2 === 0 ? 'free' : 'pro',
      slug: `ai-dev-essentials-post-${i + 1}`,
      description: `Description for post ${i + 1}`,
    },
    createdAt: new Date(`2024-01-${String(i + 1).padStart(2, '0')}`),
    updatedAt: new Date(`2024-01-${String(i + 1).padStart(2, '0')}`),
    deletedAt: null,
    name: `Author ${i + 1}`,
    image: `https://example.com/avatar${i + 1}.jpg`,
  }))

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      pathname: '/newsletters/ai-dev-essentials',
      query: {},
      push: mockPush,
      replace: mockReplace,
    } as any)
    consoleSpy.mockClear()
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  it('renders post cards correctly', () => {
    render(<AIDevEssentialsList posts={mockPosts.slice(0, 3)} />)

    expect(screen.getByText('AI Dev Essentials: Post 1')).toBeInTheDocument()
    expect(screen.getByText('AI Dev Essentials: Post 2')).toBeInTheDocument()
    expect(screen.getByText('AI Dev Essentials: Post 3')).toBeInTheDocument()
    expect(screen.getByText('Summary for post 1')).toBeInTheDocument()
    expect(screen.getByText('Author 1')).toBeInTheDocument()
  })

  it('handles pagination navigation', async () => {
    render(<AIDevEssentialsList posts={mockPosts} />)

    // Should show first 9 posts initially
    expect(screen.getByText('AI Dev Essentials: Post 1')).toBeInTheDocument()
    expect(
      screen.queryByText('AI Dev Essentials: Post 10'),
    ).not.toBeInTheDocument()

    // Navigate to page 2
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('AI Dev Essentials: Post 10')).toBeInTheDocument()
    })

    expect(
      screen.queryByText('AI Dev Essentials: Post 1'),
    ).not.toBeInTheDocument()
  })

  it('filters posts by search term', async () => {
    render(<AIDevEssentialsList posts={mockPosts} />)

    const searchInput = screen.getByPlaceholderText('Search posts...')
    fireEvent.change(searchInput, {target: {value: 'Post 1'}})

    await waitFor(() => {
      expect(screen.getByText('AI Dev Essentials: Post 1')).toBeInTheDocument()
      expect(screen.getByText('AI Dev Essentials: Post 10')).toBeInTheDocument()
      expect(
        screen.queryByText('AI Dev Essentials: Post 2'),
      ).not.toBeInTheDocument()
    })

    // Check post count
    expect(screen.getByText('6 posts')).toBeInTheDocument() // Posts 1, 10, 11, 12, 13, 14, 15
  })

  it('sorts posts by title', async () => {
    const testPosts = [
      {...mockPosts[0], fields: {...mockPosts[0].fields, title: 'Z Post'}},
      {...mockPosts[1], fields: {...mockPosts[1].fields, title: 'A Post'}},
      {...mockPosts[2], fields: {...mockPosts[2].fields, title: 'M Post'}},
    ]

    render(<AIDevEssentialsList posts={testPosts} />)

    const sortSelect = screen.getByDisplayValue('Sort by Date')
    fireEvent.change(sortSelect, {target: {value: 'title'}})

    await waitFor(() => {
      const postTitles = screen.getAllByText(/Post/)
      expect(postTitles[0]).toHaveTextContent('A Post')
      expect(postTitles[1]).toHaveTextContent('M Post')
      expect(postTitles[2]).toHaveTextContent('Z Post')
    })
  })

  it('maintains URL state', () => {
    render(<AIDevEssentialsList posts={mockPosts} />)

    const searchInput = screen.getByPlaceholderText('Search posts...')
    fireEvent.change(searchInput, {target: {value: 'test'}})

    expect(mockReplace).toHaveBeenCalledWith(
      '/newsletters/ai-dev-essentials?search=test',
      undefined,
      {shallow: true},
    )
  })

  it('initializes from URL params', () => {
    mockUseRouter.mockReturnValue({
      pathname: '/newsletters/ai-dev-essentials',
      query: {search: 'Post 1', sort: 'title', page: '2'},
      push: mockPush,
      replace: mockReplace,
    } as any)

    render(<AIDevEssentialsList posts={mockPosts} />)

    expect(screen.getByDisplayValue('Post 1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Sort by Title')).toBeInTheDocument()
  })

  it('displays empty state when no posts match search', () => {
    render(<AIDevEssentialsList posts={mockPosts} />)

    const searchInput = screen.getByPlaceholderText('Search posts...')
    fireEvent.change(searchInput, {target: {value: 'nonexistent'}})

    expect(screen.getByText('No posts found')).toBeInTheDocument()
    expect(
      screen.getByText(
        'No posts match "nonexistent". Try a different search term.',
      ),
    ).toBeInTheDocument()
  })

  it('displays empty state when no posts provided', () => {
    render(<AIDevEssentialsList posts={[]} />)

    expect(screen.getByText('No posts available')).toBeInTheDocument()
    expect(
      screen.getByText('Check back soon for new AI Dev Essentials content!'),
    ).toBeInTheDocument()
  })

  it('shows loading skeleton during pagination', async () => {
    render(<AIDevEssentialsList posts={mockPosts} />)

    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    // Should show skeleton briefly
    expect(screen.getAllByTestId('skeleton')).toHaveLength(6)

    await waitFor(
      () => {
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
      },
      {timeout: 300},
    )
  })

  it('resets to first page when searching', async () => {
    render(<AIDevEssentialsList posts={mockPosts} />)

    // Go to page 2
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Showing page 2 of')).toBeInTheDocument()
    })

    // Search should reset to page 1
    const searchInput = screen.getByPlaceholderText('Search posts...')
    fireEvent.change(searchInput, {target: {value: 'Post 1'}})

    await waitFor(() => {
      expect(screen.getByText('Showing page 1 of')).toBeInTheDocument()
    })
  })

  it('resets to first page when sorting', async () => {
    render(<AIDevEssentialsList posts={mockPosts} />)

    // Go to page 2
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Showing page 2 of')).toBeInTheDocument()
    })

    // Sort should reset to page 1
    const sortSelect = screen.getByDisplayValue('Sort by Date')
    fireEvent.change(sortSelect, {target: {value: 'title'}})

    await waitFor(() => {
      expect(screen.getByText('Showing page 1 of')).toBeInTheDocument()
    })
  })

  it('displays correct pagination info', () => {
    render(<AIDevEssentialsList posts={mockPosts} />)

    expect(screen.getByText('Showing page 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('15 posts')).toBeInTheDocument()
  })

  it('handles pagination with ellipsis for many pages', () => {
    const manyPosts = Array.from({length: 100}, (_, i) => ({
      ...mockPosts[0],
      id: `post-${i + 1}`,
      fields: {...mockPosts[0].fields, title: `Post ${i + 1}`},
    }))

    render(<AIDevEssentialsList posts={manyPosts} />)

    // Should show ellipsis in pagination
    expect(screen.getByText('...')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument() // Last page
  })

  it('disables pagination buttons appropriately', () => {
    render(<AIDevEssentialsList posts={mockPosts} />)

    const prevButton = screen.getByText('Previous')
    const nextButton = screen.getByText('Next')

    // On first page, previous should be disabled
    expect(prevButton).toBeDisabled()
    expect(nextButton).not.toBeDisabled()

    // Go to last page
    fireEvent.click(nextButton)

    waitFor(() => {
      expect(prevButton).not.toBeDisabled()
      expect(nextButton).toBeDisabled()
    })
  })

  it('logs filtering and pagination events', async () => {
    render(<AIDevEssentialsList posts={mockPosts} />)

    const searchInput = screen.getByPlaceholderText('Search posts...')
    fireEvent.change(searchInput, {target: {value: 'Post 1'}})

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('INFO: Post list filtered with term: "Post 1"'),
      )
    })
  })

  it('handles posts without images gracefully', () => {
    const postsWithoutImages = mockPosts.slice(0, 3).map((post) => ({
      ...post,
      image: undefined,
    }))

    render(<AIDevEssentialsList posts={postsWithoutImages} />)

    expect(screen.getByText('AI Dev Essentials: Post 1')).toBeInTheDocument()
    expect(screen.getByText('egghead')).toBeInTheDocument() // Fallback name
  })

  it('truncates long descriptions correctly', () => {
    const postWithLongDescription = {
      ...mockPosts[0],
      fields: {
        ...mockPosts[0].fields,
        summary:
          'This is a very long summary that should be truncated when displayed in the post card component because it exceeds the maximum length limit that we have set for the description text in the UI component.',
      },
    }

    render(<AIDevEssentialsList posts={[postWithLongDescription]} />)

    const truncatedText = screen.getByText(
      /This is a very long summary that should be truncated/,
    )
    expect(truncatedText.textContent?.length).toBeLessThan(150) // Should be truncated
  })

  it('applies custom className correctly', () => {
    const customClass = 'custom-list-class'
    const {container} = render(
      <AIDevEssentialsList posts={mockPosts} className={customClass} />,
    )

    expect(container.firstChild).toHaveClass(customClass)
  })
})
