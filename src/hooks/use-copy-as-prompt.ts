'use client'
import {useState, useCallback} from 'react'
import {track} from '@/utils/analytics'
import {
  formatContentAsPrompt,
  validateContentData,
  estimateContentSize,
} from '@/lib/format-content-as-prompt'
import {PostType} from '@/schemas/post'

interface LessonData {
  title: string
  description?: string | null
  transcript?: string | null
}

interface CopyContentData {
  title: string
  description?: string | null
  transcript?: string | null
  lessons?: LessonData[]
  contentType: PostType
  contentId?: string | number
}

interface CopyState {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  error?: string
}

interface UseCopyAsPromptReturn {
  copyState: CopyState
  copyContent: (data: CopyContentData) => Promise<void>
  resetState: () => void
}

export function useCopyAsPrompt(): UseCopyAsPromptReturn {
  const [copyState, setCopyState] = useState<CopyState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
  })

  const resetState = useCallback(() => {
    setCopyState({
      isLoading: false,
      isSuccess: false,
      isError: false,
    })
  }, [])

  const copyContent = useCallback(async (data: CopyContentData) => {
    // Track click event
    track('copy_as_prompt_clicked', {
      content_type: data.contentType,
      content_id: data.contentId,
      content_length: estimateContentSize(data),
    })

    setCopyState({
      isLoading: true,
      isSuccess: false,
      isError: false,
    })

    try {
      // Validate content data
      const validation = validateContentData(data)

      if (!validation.isValid) {
        console.error('❌ Validation failed:', validation.errors)
        throw new Error(`Invalid content data: ${validation.errors.join(', ')}`)
      }

      // Check if clipboard API is available
      if (!navigator.clipboard) {
        console.error('❌ Clipboard API not available')
        throw new Error('Clipboard API not available in this browser')
      }

      // Format content as XML
      const formattedContent = formatContentAsPrompt(data)

      // Copy to clipboard using native API
      await navigator.clipboard.writeText(formattedContent)

      // Track success
      track('copy_as_prompt_success', {
        content_type: data.contentType,
        content_id: data.contentId,
        content_length: formattedContent.length,
      })

      setCopyState({
        isLoading: false,
        isSuccess: true,
        isError: false,
      })

      // Reset success state after 2 seconds
      setTimeout(() => {
        setCopyState((prev) => ({
          ...prev,
          isSuccess: false,
        }))
      }, 2000)
    } catch (error) {
      console.error('❌ useCopyAsPrompt.copyContent - ERROR:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to copy content'

      // Track error
      track('copy_as_prompt_error', {
        content_type: data.contentType,
        content_id: data.contentId,
        error: errorMessage,
      })

      setCopyState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: errorMessage,
      })

      // Reset error state after 3 seconds
      setTimeout(() => {
        setCopyState((prev) => ({
          ...prev,
          isError: false,
          error: undefined,
        }))
      }, 3000)
    }
  }, [])

  return {
    copyState,
    copyContent,
    resetState,
  }
}
