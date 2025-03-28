import Image from 'next/image'
import Link from 'next/link'
import {ArrowRight, BookOpen} from 'lucide-react'

import {Button} from '@/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/card'

interface CourseLessonCtaProps {
  course: {
    slug: string
    title: string
    description: string
    image: string
    totalLessons: number
    position: number
  }
}

export function CourseLessonCta({course}: CourseLessonCtaProps) {
  return (
    <Card className="border-muted-foreground/50 my-6 w-fit mx-auto">
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 w-fit py-4 px-4 sm:px-6">
        <div>
          <Image
            src={course.image}
            alt={course.title}
            height={100}
            width={100}
          />
        </div>
        <div className="flex-1 max-w-[600px]">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>
                {course.position
                  ? `Lesson ${course.position} of ${course.totalLessons}`
                  : `${course.totalLessons} lessons`}
              </span>
            </div>
            <CardTitle className="text-md">{course.title}</CardTitle>
            <CardDescription className="line-clamp-2 text-balance max-w-[400px]">
              {course.description}
            </CardDescription>
          </CardHeader>
          <CardFooter className="">
            <Button asChild variant="ghost" className="px-0 text-sm">
              <Link href={`/courses/${course.slug}`}>
                View Full Course <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}
