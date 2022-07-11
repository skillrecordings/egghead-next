import {NextRequest, NextResponse} from 'next/server'

export function rewriteToPath(path: string, req: NextRequest) {
  const baseUrlForRewrites = req.nextUrl.clone()
  baseUrlForRewrites.pathname = path
  return NextResponse.rewrite(baseUrlForRewrites)
}
