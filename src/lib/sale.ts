import CourseGrid from '@/components/pages/20-days-of-egghead/course-grid'

const saleOn = process.env.NEXT_PUBLIC_FLASH_SALE

async function loadHolidayCourses() {
  return {resources: []}
}

export {saleOn, loadHolidayCourses, CourseGrid}
