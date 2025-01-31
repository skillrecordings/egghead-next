import Link from 'next/link'
import Image from 'next/image'

import {
  useVideoPlayerOverlay,
  type CompletedAction,
} from '@/hooks/mux/use-video-player-overlay'
import {Post} from '@/pages/[post]'
import Spinner from '@/spinner'
import {Button} from '@/ui/button'
import {ArrowRight} from 'lucide-react'
import {RefreshCw} from 'lucide-react'
import {Card, CardContent, CardTitle, CardHeader, CardFooter} from '@/ui/card'
import {motion} from 'framer-motion'

type VideoPlayerOverlayProps = {
  resource: Post
}

const VideoPlayerOverlay: React.FC<VideoPlayerOverlayProps> = ({resource}) => {
  const {state: overlayState, dispatch} = useVideoPlayerOverlay()

  switch (overlayState.action?.type) {
    case 'COMPLETED':
      const {playerRef, cta} = overlayState.action as CompletedAction

      if (cta === 'cursor_workshop') {
        return (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            aria-live="polite"
            className="z-40 bg-background/85 absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center pb-6 backdrop-blur-md sm:pb-16 text-white"
          >
            <CursorCTAOverlay
              signUpLink="/workshop/cursor"
              onReplay={() => {
                if (playerRef.current) {
                  playerRef.current.play()
                }
                dispatch({type: 'HIDDEN'})
              }}
            />
          </motion.div>
        )
      }

      return (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          aria-live="polite"
          className="z-40 bg-background/85 absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center pb-6 backdrop-blur-md sm:pb-16 text-white"
        >
          <div className="flex flex-col items-center justify-center gap-2 p-4">
            <h2 className="text-lg sm:text-2xl font-bold mb-4 text-center">
              {resource.fields.title}
            </h2>
            <Button
              variant="outline"
              onClick={() => {
                if (playerRef.current) {
                  playerRef.current.play()
                }
                dispatch({type: 'HIDDEN'})
              }}
              className="border border-blue-600 hover:bg-blue-600"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Watch again
            </Button>
          </div>
        </motion.div>
      )
    case 'LOADING':
      return (
        <div
          aria-live="polite"
          className="text-foreground absolute left-0 top-0 z-40 flex aspect-video h-full w-full flex-col items-center justify-center gap-10 bg-black/80 p-5 text-lg backdrop-blur-md"
        >
          <Spinner className="text-white" />
        </div>
      )
    case 'HIDDEN':
      return null
    default:
      return null
  }
}

export default VideoPlayerOverlay

function CursorCTAOverlay({
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
                src="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/411/full/cursor.png"
                alt="Cursor"
                width={80}
                height={80}
                className="hidden sm:block"
              />
              <h2 className="text-md sm:text-2xl font-bold sm:mb-4 text-balance">
                Take Cursor to the Next Level with Live Training
              </h2>
            </div>
            <p className="text-center mb-2 sm:mb-6 text-muted-foreground text-balance">
              John Lindquist is teaching a workshop on how to use Cursor to it's
              fullest abilities. Get notified when the workshop is released.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row-reverse sm:flex-col gap-2 sm:gap-4 items-center justify-center p-0">
          <Link href={signUpLink} className="">
            <Button className="w-full max-w-xs bg-blue-500 hover:bg-blue-600">
              Join Waitlist
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={onReplay}
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
