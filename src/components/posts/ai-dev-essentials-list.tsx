import * as React from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import {Post} from '@/pages/[post]'
import {truncate} from 'lodash'
import removeMarkdown from 'remove-markdown'

interface AIDevEssentialsListProps {
  posts: Post[]
  className?: string
}

const POSTS_PER_PAGE = 9

export default function AIDevEssentialsList({
  posts,
  className = '',
}: AIDevEssentialsListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [sortBy, setSortBy] = React.useState<'date' | 'title'>('date')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)

  // Update URL params when filters change
  React.useEffect(() => {
    const query = new URLSearchParams()
    if (searchTerm) query.set('search', searchTerm)
    if (sortBy !== 'date') query.set('sort', sortBy)
    if (currentPage > 1) query.set('page', currentPage.toString())

    const newUrl = `${router.pathname}${
      query.toString() ? `?${query.toString()}` : ''
    }`
    if (newUrl !== router.asPath) {
      router.replace(newUrl, undefined, {shallow: true, scroll: false})
    }
  }, [searchTerm, sortBy, currentPage, router])

  // Initialize from URL params
  React.useEffect(() => {
    const {search, sort, page} = router.query
    if (search && typeof search === 'string') setSearchTerm(search)
    if (sort && (sort === 'date' || sort === 'title')) setSortBy(sort)
    if (page && typeof page === 'string') {
      const pageNum = parseInt(page, 10)
      if (!isNaN(pageNum) && pageNum > 0) setCurrentPage(pageNum)
    }
  }, [router.query])

  // Filter and sort posts
  const filteredAndSortedPosts = React.useMemo(() => {
    console.log(
      `INFO: Post list filtered with term: "${searchTerm}", sort: ${sortBy}`,
    )

    let filtered = posts

    if (searchTerm) {
      filtered = posts.filter(
        (post) =>
          post.fields.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (post.fields.summary &&
            post.fields.summary
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (post.fields.description &&
            post.fields.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())),
      )
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'title') {
        return a.fields.title.localeCompare(b.fields.title)
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return sorted
  }, [posts, searchTerm, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = filteredAndSortedPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE,
  )

  React.useEffect(() => {
    console.log(
      `INFO: Post list filtered with term: "${searchTerm}", showing ${paginatedPosts.length} of ${filteredAndSortedPosts.length} results, page: ${currentPage}`,
    )
  }, [
    searchTerm,
    paginatedPosts.length,
    filteredAndSortedPosts.length,
    currentPage,
  ])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'date' | 'title')
    setCurrentPage(1) // Reset to first page when sorting
  }

  const handlePageChange = (page: number) => {
    setIsLoading(true)
    setCurrentPage(page)
    // Simulate loading for better UX
    setTimeout(() => setIsLoading(false), 200)
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <div className="flex-1 max-w-md">
          <label htmlFor="search" className="sr-only">
            Search posts
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search posts..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="sort" className="sr-only">
              Sort by
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={handleSortChange}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredAndSortedPosts.length} post
            {filteredAndSortedPosts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <PostListSkeleton />
      ) : paginatedPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState searchTerm={searchTerm} />
      )}

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

function PostCard({post}: {post: Post}) {
  const {fields, createdAt, name, image} = post
  const {title, summary, slug, description} = fields

  const postDescription = summary || description || ''
  const truncatedDescription = truncate(removeMarkdown(postDescription), {
    length: 120,
  })

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center mb-3">
          {image && (
            <Image
              src={image}
              alt={name || 'Author'}
              width={32}
              height={32}
              className="rounded-full mr-2"
            />
          )}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <div>{name || 'egghead'}</div>
            <div>{formattedDate}</div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          <Link
            href={`/${slug}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {title}
          </Link>
        </h3>

        {truncatedDescription && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {truncatedDescription}
          </p>
        )}

        <Link
          href={`/${slug}`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Read more
          <svg
            className="ml-1 w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  )
}

function PostListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({length: 6}).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
        >
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            </div>
          </div>
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({searchTerm}: {searchTerm: string}) {
  return (
    <div className="text-center py-12">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        {searchTerm ? 'No posts found' : 'No posts available'}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {searchTerm
          ? `No posts match "${searchTerm}". Try a different search term.`
          : 'Check back soon for new AI Dev Essentials content!'}
      </p>
    </div>
  )
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const getPageNumbers = () => {
    const pages = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 mt-8"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Showing page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div className="flex-1 flex justify-between sm:justify-end">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="hidden md:flex space-x-1 mx-4">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === 'ellipsis' ? (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </nav>
  )
}
