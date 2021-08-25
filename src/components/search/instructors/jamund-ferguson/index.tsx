import SearchInstructorEssential from '../instructor-essential'

export default function SearchJamundFerguson({instructor}: {instructor: any}) {
  return (
    <div>
      <SearchInstructorEssential
        instructor={instructor}
        // CTAComponent={
        //   <FeaturedTypescriptCourse
        //     resource={primaryCourse}
        //     location="Jamund Ferguson instructor page"
        //   />
        // }
      />
    </div>
  )
}
