'use client'
import React from 'react'
import {cn} from '@/ui/utils'
import {useCopyAsPrompt} from '@/hooks/use-copy-as-prompt'
import {useViewer} from '@/context/viewer-context'
import {track} from '@/utils/analytics'
import Link from 'next/link'
import {PostType} from '@/schemas/post'
import LockIcon from '@/components/icons/lock'

interface LessonData {
  title: string
  description?: string | null
  transcript?: string | null
}

interface CopyAsPromptButtonProps {
  title: string
  description?: string | null
  transcript?: string | null
  lessons?: LessonData[]
  contentType: PostType
  contentId?: string | number
  requiresPro?: boolean
  className?: string
  onCopy?: () => void
}

function CopyIcon({className}: {className?: string}) {
  return (
    <svg
      className={cn('w-4 h-4', className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  )
}

function CheckIcon({className}: {className?: string}) {
  return (
    <svg
      className={cn('w-4 h-4', className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

function LoadingSpinner({className}: {className?: string}) {
  return (
    <svg
      className={cn('animate-spin w-4 h-4', className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export function CopyAsPromptButton({
  title,
  description,
  transcript,
  lessons,
  contentType,
  contentId,
  requiresPro = false,
  className,
  onCopy,
}: CopyAsPromptButtonProps) {
  const {viewer} = useViewer()
  const {copyState, copyContent} = useCopyAsPrompt()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isPro = mounted ? Boolean(viewer?.is_pro) : false
  const canAccess = !requiresPro || isPro

  const handleClick = async () => {
    if (!canAccess) {
      // Track pro gate interaction
      track('copy_as_prompt_pro_gate_shown', {
        content_type: contentType,
        content_id: contentId,
        user_pro_status: isPro,
      })
      return
    }

    try {
      await copyContent({
        title,
        description,
        transcript,
        lessons,
        contentType,
        contentId,
      })
      onCopy?.()
    } catch (error) {
      console.error('❌ CopyAsPromptButton.handleClick - ERROR:', error)
      throw error
    }
  }

  const handleUpgradeClick = () => {
    track('copy_as_prompt_upgrade_clicked', {
      content_type: contentType,
      content_id: contentId,
      source: 'copy_button',
    })
  }

  // Pro gate for restricted content - only render after mount to avoid hydration mismatch
  if (requiresPro && mounted && !isPro) {
    return (
      <div className="relative group">
        <button
          onClick={handleClick}
          className={cn(
            'text-gray-600 dark:text-gray-300 flex flex-row items-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-4 py-2 border transition-colors text-sm xs:text-base ease-in-out opacity-90 shadow-sm cursor-not-allowed',
            className,
          )}
          disabled
          title="Pro membership required"
        >
          <LockIcon className="w-4 h-4" />
          <span className="ml-2">Copy {contentType} as prompt</span>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          <div className="text-center">
            <div>Pro membership required</div>
            <Link
              href="/pricing"
              onClick={handleUpgradeClick}
              className="text-blue-300 hover:text-blue-200 underline pointer-events-auto"
            >
              Upgrade now
            </Link>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      </div>
    )
  }

  // Regular copy button
  return (
    <button
      onClick={handleClick}
      disabled={copyState.isLoading}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors',
        'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400',
        'border border-gray-200 dark:border-gray-800',
        'hover:bg-gray-100 dark:hover:bg-gray-900/30',
        'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        copyState.isSuccess &&
          'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
        copyState.isError &&
          'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
        className,
      )}
      title={
        copyState.isError
          ? copyState.error
          : 'Copy content as XML prompt for LLMs'
      }
    >
      {copyState.isLoading ? (
        <LoadingSpinner />
      ) : copyState.isSuccess ? (
        <CheckIcon />
      ) : (
        <CopyIcon />
      )}

      {copyState.isLoading
        ? 'Copying...'
        : copyState.isSuccess
        ? 'Copied!'
        : copyState.isError
        ? 'Error'
        : `Copy ${contentType} as prompt`}
    </button>
  )
}
