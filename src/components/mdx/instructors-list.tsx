import Image from 'next/image'

type Instructor = {
  name: string
  photo: string
}

const instructors: Instructor[] = [
  {
    name: 'Kent C. Dodds',
    photo:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683164194/assets/kcd.webp',
  },
  {
    name: 'John Lindquist',
    photo:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683164538/assets/john.webp',
  },
  {
    name: 'Dan Abramov',
    photo:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683164605/assets/dan.webp',
  },
]

const InstructorsList = () => {
  return (
    <div className="flex flex-row items-center justify-center">
      {instructors.map((instructor) => (
        <div key={instructor.name} className="flex flex-row items-center mr-8">
          <div className="w-16 h-16 relative mr-4 rounded-full overflow-hidden md:block hidden">
            <Image
              src={instructor.photo}
              alt={instructor.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div>
            <div className="md:text-lg xl:md:text-lg">{instructor.name}</div>
            <div className="text-sm text-gray-500">egghead Instructor</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default InstructorsList
