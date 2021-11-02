import {NextRequest, NextResponse} from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

/**
 * with this approach, logged in users can be shown
 * '/' and anon users '/signup' IN PLACE
 *
 * we don't have a server cookie to get member status, but that
 * should be on the short list. That would make this even better
 * because we could send them into a more specific /learn route
 * and we could start personalizing that a bit more using various
 * cookies and such.
 *
 * This looks a lot like the i18n example:
 * https://github.com/vercel/examples/tree/main/edge-functions/i18n
 *
 * an the split testing example that puts them in a bucket:
 * https://github.com/vercel/examples/edge-functions/ab-testing-simple
 *
 */
export function middleware(req: NextRequest) {
  // Only rewrite files that don't have a file extension (think favicon)
  // Only rewrite if we are at the root
  if (req.nextUrl.pathname === '/' && !PUBLIC_FILE.test(req.nextUrl.pathname)) {
    // if there's a cookie with a token they are logged in
    let status = req.cookies.eh_token_2020_11_22 ? 'logged_in' : 'anon'
    req.nextUrl.pathname = status === 'logged_in' ? `/` : `/signup`
    return NextResponse.rewrite(req.nextUrl)
  }
}
