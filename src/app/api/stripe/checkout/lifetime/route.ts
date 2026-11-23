import {NextResponse} from 'next/server'
import {withAppApiLogging} from '@/lib/logging'

async function _POST() {
  return NextResponse.json({error: 'Lifetime sales are closed'}, {status: 410})
}

export const POST = withAppApiLogging(_POST)
