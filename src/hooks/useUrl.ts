export function useURL(path?: string) {
  return `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${path || ''}`
}
