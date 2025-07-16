import Link from 'next/link'
import Image from 'next/image'
import {Button} from '@/ui/button'
import {ArrowRight} from 'lucide-react'
import {RefreshCw} from 'lucide-react'
import {Card, CardContent, CardFooter} from '@/ui/card'
import {track} from '@/utils/analytics'

function ClaudeCodeCTAOverlay({
  signUpLink,
  onReplay,
}: {
  signUpLink: string
  onReplay: () => void
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-2xl border-none">
        <CardContent className="text-center p-0 sm:p-6">
          <div className="sm:px-8 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/513/full/claude.png"
                alt="Claude Code"
                width={80}
                height={80}
                className="hidden sm:block"
              />
              <h2 className="text-md sm:text-2xl font-bold sm:mb-4 text-balance">
                Master Claude Code with Live Expert Training
              </h2>
            </div>
            <p className="text-center mb-2 sm:mb-6 text-muted-foreground text-balance">
              Join our comprehensive Claude Code workshops to unlock the full
              potential of AI-assisted development. Learn advanced techniques,
              best practices, and workflows from industry experts.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row-reverse sm:flex-col gap-2 sm:gap-4 items-center justify-center p-0">
          <Link href={signUpLink} className="">
            <Button
              className="w-full max-w-xs bg-blue-500 hover:bg-blue-600"
              onClick={() => {
                track('claude code overlay', {
                  action: 'sign_up_clicked',
                  source: 'video_completion_overlay',
                })
              }}
            >
              Join the workshop
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => {
              track('claude code overlay', {
                action: 'replay_clicked',
                source: 'video_completion_overlay',
              })
              onReplay()
            }}
            className="border border-blue-600 hover:bg-blue-600"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Watch again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ClaudeCodeCTAOverlay
