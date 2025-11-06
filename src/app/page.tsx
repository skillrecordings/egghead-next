import {redirect} from 'next/navigation'

export default function HomePage() {
  // Temporarily redirect to the pages router route
  // until the proper app router homepage is implemented
  redirect('/q')
}
