import axios from 'axios'

/**
 * API Utilities
 *
 * This module contains utility functions for making API requests to the egghead backend.
 * It provides a standardized way to send requests with proper authentication and parameter formatting.
 */

/**
 * Sends a request to the egghead API using axios.
 *
 * This function is useful for updating objects in Rails, as it formats parameters.
 *
 * @param path The endpoint path appended to the base URL
 * @param paramsObject An object containing key-value pairs to be sent as URLSearchParams
 * @param method The HTTP method to use (default: 'post')
 * @param headers Optional additional headers to include in the request
 * @param baseURL Optional base URL to override the default
 * @returns A Promise that resolves with the API response
 *
 * @example
 * // Updating a playlist title
 * sendRequestWithEggAxios('/api/v1/playlists/123', { 'playlist[title]': 'New Title' }, 'put')
 *
 * @example
 * // Creating a new playlist
 * sendRequestWithEggAxios('/api/v1/playlists', { 'playlist[title]': 'New Playlist', 'playlist[description]': 'New Description' })
 */
export const sendRequestWithEggAxios = async (
  path: string,
  paramsObject: Record<string, string>,
  method: 'post' | 'put' = 'post',
  headers?: Record<string, string>,
  baseURL?: string,
) => {
  return await axios
    .create({
      baseURL: baseURL || process.env.NEXT_PUBLIC_AUTH_DOMAIN || '',
      headers: {
        Authorization: `Bearer ${process.env.EGGHEAD_ADMIN_TOKEN || ''}`,
        ...headers,
      },
    })
    [method](path, new URLSearchParams(paramsObject))
}
