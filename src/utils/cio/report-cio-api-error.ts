/**
 * Reports CIO API errors with structured logging.
 * Defensive: never throws, even for non-axios errors.
 */
export async function reportCioApiError(error: any) {
  try {
    const isAxiosError = !!error?.response
    const cioId = isAxiosError
      ? error.response?.config?.url?.split('/')?.pop()
      : undefined

    console.error(
      JSON.stringify({
        event: 'cio_api_error',
        error_message: error?.message || 'unknown',
        error_status: error?.response?.status,
        error_path: error?.response?.config?.url,
        cio_id: cioId,
        is_axios_error: isAxiosError,
      }),
    )
  } catch {
    // Never let the error reporter itself throw
    console.error('reportCioApiError failed:', error?.message)
  }
}
