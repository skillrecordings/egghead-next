import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SearchCuratedEssential from '../curated-essential'
import {bpMinMD} from 'utils/breakpoints'
import {track} from 'utils/analytics'
import {get, find} from 'lodash'
import data from './css-page-data'
import ExternalTrackedLink from 'components/external-tracked-link'
import {VerticalResourceCollectionCard} from '../../../card/vertical-resource-collection-card'

const SearchCSS = () => {
  const resources: any = get(data, 'resources')
  const levels: any = get(
    find(resources, {slug: {current: 'css-by-skill-level'}}),
    'resources',
  )
  const animation: any = find(resources, {slug: {current: 'css-animation'}})

  return (
    <>
      <SearchCuratedEssential
        verticalImage={data?.image}
        topic={{
          label: 'CSS',
          name: 'css',
          description: data.description,
        }}
        CTAComponent={CssFormStyling}
      />
      <div className="grid grid-cols-1 mt-8 gap-5 lg:grid-cols-3 md:grid-cols-1">
        {levels?.map((resource: any) => {
          return (
            <VerticalResourceCollectionCard
              location={data.slug.current}
              key={resource._id}
              resource={{
                ...resource,
                title: resource.name,
                name: '',
              }}
            />
          )
        })}
      </div>
      <div className="grid md:grid-cols-2 gap-5 mt-5 md:gap-8 md:mt-8">
        <VerticalResourceCollectionCard resource={{...animation, name: ''}} />
      </div>
    </>
  )
}

const CssFormStyling: React.FC<{location: string}> = ({location}) => {
  const {path, title, byline, name, description, image, background, slug} = {
    title: 'Accessible Cross-Browser CSS Form Styling',
    byline: 'Stephanie Eckles',
    name: 'FEATURED COURSE',
    description: `Confidently build out an accessiblility focused form design system that works in all browsers.`,
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/425/628/full/EGH_accessible-css.png',
    background:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1614094471/next.egghead.io/resources/accessible-cross-browser-css-form-styling/bg-for-accessible-cross-browser-css-form-styling_2x.png',
    path: '/courses/accessible-cross-browser-css-form-styling-7297',
    slug: 'accessible-cross-browser-css-form-styling-7297',
  }
  return (
    <ExternalTrackedLink
      eventName="clicked CSS page CTA"
      params={{location}}
      className="relative block w-full h-full overflow-hidden text-center border-0 border-gray-100 rounded-md md:col-span-4"
      href="/courses/accessible-cross-browser-css-form-styling-7297"
    >
      <div
        className="flex items-center justify-center overflow-hidden text-white bg-gray-900 rounded-t-lg rounded-b-lg shadow-sm md:-mt-5 dark:bg-gray-800 md:rounded-t-none"
        css={{
          [bpMinMD]: {
            minHeight: 477,
          },
        }}
      >
        <div className="absolute top-0 left-0 z-20 w-full h-2 bg-gradient-to-r from-yellow-500 to-sky-500" />
        <div className="relative z-10 px-5 py-10 text-center sm:py-16 sm:text-left">
          <div className="flex items-center justify-center max-w-screen-xl mx-auto space-y-5">
            <div className="flex flex-col items-center justify-center space-y-5 sm:space-x-5 sm:space-y-0">
              <div className="flex-shrink-0">
                <Link href={path}>
                  <a
                    tabIndex={-1}
                    onClick={() =>
                      track('clicked jumbotron resource', {
                        resource: path,
                        linkType: 'image',
                      })
                    }
                  >
                    <Image
                      quality={100}
                      src={get(image, 'src', image)}
                      width={250}
                      height={250}
                      alt={get(image, 'alt', `illustration for ${title}`)}
                    />
                  </a>
                </Link>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <h2 className="mb-2 text-xs font-semibold text-white uppercase">
                  {byline}
                </h2>
                <Link href={path}>
                  <a
                    className="text-xl font-extrabold leading-tighter hover:text-blue-300"
                    onClick={() =>
                      track('clicked jumbotron resource', {
                        resource: path,
                        linkType: 'text',
                      })
                    }
                  >
                    <h1>{title}</h1>
                  </a>
                </Link>
                <p className="mt-4">{description}</p>
              </div>
            </div>
          </div>
        </div>
        <UniqueBackground className="absolute top-0 left-0 z-0 w-full h-full" />
      </div>
    </ExternalTrackedLink>
  )
}

const UniqueBackground = ({className, background}: any) => {
  return (
    <svg
      className={className}
      viewBox="0 0 400 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f)">
        <path
          d="M92.502 51.2954L51.5042 75.608C50.8389 76.0025 50.8542 76.9707 51.5316 77.344L73.9849 89.7162C74.3028 89.8914 74.6908 89.8805 74.9984 89.6877L114.577 64.8916C115.219 64.4893 115.198 63.5466 114.538 63.1736L93.5041 51.2849C93.1923 51.1087 92.81 51.1127 92.502 51.2954Z"
          fill="#FF5574"
        />
      </g>
      <g filter="url(#filter1_f)">
        <path
          d="M963.502 548.295L922.504 572.608C921.839 573.003 921.854 573.971 922.532 574.344L944.985 586.716C945.303 586.891 945.691 586.88 945.998 586.688L985.577 561.892C986.219 561.489 986.198 560.547 985.538 560.174L964.504 548.285C964.192 548.109 963.81 548.113 963.502 548.295Z"
          fill="#7B7DA8"
        />
      </g>
      <g opacity="0.8" filter="url(#filter2_f)">
        <path
          d="M453.489 545.864L424.479 508.044C424.008 507.43 423.049 507.56 422.759 508.277L413.141 532.041C413.005 532.378 413.062 532.762 413.29 533.044L442.611 569.397C443.087 569.987 444.021 569.854 444.313 569.155L453.619 546.857C453.757 546.527 453.707 546.148 453.489 545.864Z"
          fill="#FF5574"
        />
      </g>
      <g opacity="0.6" filter="url(#filter3_f)">
        <path
          d="M1001.69 322.087L993.96 369.121C993.834 369.884 994.586 370.494 995.307 370.215L1019.22 360.968C1019.56 360.837 1019.8 360.533 1019.85 360.173L1026.29 313.916C1026.4 313.165 1025.66 312.575 1024.95 312.841L1002.32 321.312C1001.99 321.438 1001.75 321.733 1001.69 322.087Z"
          fill="#FF826E"
        />
      </g>
      <g filter="url(#filter4_f)">
        <path
          d="M-18.9629 161.499L4.6305 202.915C5.01337 203.587 5.98162 203.589 6.36668 202.918L19.1289 180.684C19.3096 180.369 19.3055 179.981 19.1181 179.67L-4.98347 139.665C-5.37457 139.016 -6.3175 139.021 -6.70188 139.674L-18.9559 160.497C-19.1375 160.806 -19.1402 161.188 -18.9629 161.499Z"
          fill="#7E80AB"
        />
      </g>
      <g opacity="0.8" filter="url(#filter5_f)">
        <path
          d="M718.067 65.5207L743.11 107.044C743.498 107.688 744.431 107.689 744.821 107.046L758.344 84.7451C758.541 84.4195 758.537 84.01 758.332 83.6889L732.752 43.5787C732.356 42.9581 731.448 42.9633 731.06 43.5884L718.074 64.4762C717.875 64.7954 717.873 65.1989 718.067 65.5207Z"
          fill="#7E80AB"
        />
      </g>
      <g opacity="100" filter="url(#filter6_f)">
        <path
          d="M455.422 118.262L409.24 106.464C408.491 106.273 407.817 106.968 408.032 107.711L415.161 132.336C415.262 132.685 415.544 132.952 415.897 133.033L461.417 143.486C462.156 143.655 462.807 142.974 462.604 142.243L456.138 118.964C456.042 118.618 455.769 118.351 455.422 118.262Z"
          fill="#FAF8F7"
        />
      </g>

      <g filter="url(#filter8_f)">
        <path
          d="M201.269 572.749L275.145 678.13C276.464 680.011 279.321 679.773 280.31 677.699L296.13 644.503C296.597 643.523 296.498 642.366 295.87 641.48L221.383 536.217C220.048 534.332 217.173 534.598 216.208 536.697L201 569.774C200.554 570.743 200.657 571.876 201.269 572.749Z"
          fill="#1DB9E8"
        />
      </g>
      <g opacity="0.8" filter="url(#filter9_f)">
        <path
          d="M1134.27 16.7493L1208.15 122.13C1209.46 124.011 1212.32 123.773 1213.31 121.699L1229.13 88.5034C1229.6 87.5229 1229.5 86.3665 1228.87 85.4799L1154.38 -19.7827C1153.05 -21.6683 1150.17 -21.4018 1149.21 -19.303L1134 13.774C1133.55 14.7431 1133.66 15.8759 1134.27 16.7493Z"
          fill="#1DB9E8"
        />
      </g>
      <g opacity="0.8" filter="url(#filter11_f)">
        <path
          d="M1086.97 553.684L1131.05 674.595C1131.84 676.753 1134.66 677.262 1136.15 675.515L1160.03 647.545C1160.73 646.719 1160.94 645.576 1160.56 644.557L1115.85 523.603C1115.05 521.436 1112.21 520.949 1110.73 522.727L1087.48 550.741C1086.8 551.561 1086.6 552.682 1086.97 553.684Z"
          fill="#FFCF63"
        />
      </g>
      <g opacity="0.8" filter="url(#filter12_f)">
        <path
          d="M406.114 -11.2216L292.874 49.9291C290.852 51.0208 290.758 53.8866 292.703 55.109L323.839 74.6734C324.759 75.2513 325.919 75.287 326.872 74.7667L440.066 12.9947C442.094 11.8882 442.163 9.0014 440.19 7.79946L409.101 -11.1437C408.19 -11.6987 407.053 -11.7284 406.114 -11.2216Z"
          fill="#FFCF63"
        />
      </g>
      <g opacity="0.7" filter="url(#filter13_f)">
        <path
          d="M695.073 566.841L609.473 662.941C607.945 664.657 608.833 667.383 611.079 667.869L647.02 675.643C648.081 675.873 649.184 675.511 649.903 674.697L735.248 578.028C736.777 576.296 735.857 573.559 733.593 573.102L697.907 565.895C696.862 565.684 695.783 566.044 695.073 566.841Z"
          fill="#A2C69A"
        />
      </g>
      <g opacity="0.7" filter="url(#filter14_f)">
        <path
          d="M1045.24 108.637L918.491 86.3597C916.228 85.962 914.376 88.1513 915.144 90.3168L927.43 124.976C927.793 125.999 928.681 126.747 929.751 126.93L1056.85 148.692C1059.13 149.081 1060.98 146.86 1060.17 144.693L1047.54 110.551C1047.17 109.55 1046.29 108.822 1045.24 108.637Z"
          fill="#A2C69A"
        />
      </g>
      <g filter="url(#filter15_f)">
        <path
          d="M181.422 107.262L135.24 95.4641C134.491 95.2726 133.817 95.968 134.032 96.711L141.161 121.336C141.262 121.685 141.544 121.952 141.897 122.033L187.417 132.486C188.156 132.655 188.807 131.974 188.604 131.243L182.138 107.964C182.042 107.618 181.769 107.351 181.422 107.262Z"
          fill="#FF826E"
        />
      </g>
      <defs>
        <filter
          id="filter0_f"
          x="47.0142"
          y="47.1555"
          width="72.0317"
          height="46.6848"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter1_f"
          x="918.014"
          y="544.155"
          width="72.0317"
          height="46.6848"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter2_f"
          x="406.289"
          y="500.653"
          width="54.0168"
          height="76.1734"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter3_f"
          x="967.913"
          y="297.727"
          width="84.7931"
          height="87.9172"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="3.5" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter4_f"
          x="-23.8268"
          y="134.957"
          width="47.7965"
          height="72.6971"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter5_f"
          x="713.189"
          y="38.8789"
          width="50.0094"
          height="72.8955"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter6_f"
          x="394.83"
          y="84.8271"
          width="80.6315"
          height="80.6315"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter7_f"
          x="77.757"
          y="492.516"
          width="76.7924"
          height="55.2199"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter8_f"
          x="193.719"
          y="525.032"
          width="109.714"
          height="164.239"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter9_f"
          x="1126.72"
          y="-30.9675"
          width="109.714"
          height="164.239"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter10_f"
          x="-57.2255"
          y="319.027"
          width="121.591"
          height="170.245"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter11_f"
          x="1062.97"
          y="514.036"
          width="121.591"
          height="170.245"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter12_f"
          x="286.673"
          y="-18.9001"
          width="159.565"
          height="101.35"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter13_f"
          x="573.726"
          y="541.129"
          width="197.455"
          height="159.309"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="7" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter14_f"
          x="897.755"
          y="31.7468"
          width="179.423"
          height="172.03"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur" />
        </filter>
        <filter
          id="filter15_f"
          x="110.83"
          y="63.8271"
          width="100.632"
          height="100.632"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="7" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  )
}

export default SearchCSS
