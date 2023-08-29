import {NextRequest, NextResponse} from 'next/server'
import {getMiddlewareResponse} from './server/get-middleware-response'

const PUBLIC_FILE = /\.(.*)$/

// The allow-list of paths where this middleware executes (perf)
export const config = {
  matcher: ['/', '/pricing'],
}

export async function middleware(req: NextRequest) {
  // think favicon etc as PUBLIC_FILE
  if (PUBLIC_FILE.test(req.nextUrl.pathname)) return NextResponse.next()

  return getMiddlewareResponse(req)
}
