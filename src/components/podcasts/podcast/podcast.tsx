import React, {FunctionComponent} from 'react'
import Markdown from 'react-markdown/with-html'
import Image from 'next/image'
import {PodcastResource} from 'types'

type PodcastProps = {
  podcast: PodcastResource
}

const LINKS = [
  {
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="23"
        viewBox="0 0 22 23"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M13.2327518,10.3921111 C13.2327518,13.2617639 8.98365108,13.2617639 8.98365108,10.3921111 C8.98365108,7.52245833 13.2327518,7.52245833 13.2327518,10.3921111 Z M12.1704766,21.156 L10.0459263,21.156 C8.98365108,21.156 8.45251349,16.9639497 8.45251349,15.7740556 C8.45251349,14.5841615 9.64135876,13.6212778 11.1082014,13.6212778 C12.5750441,13.6212778 13.7638894,14.5841615 13.7638894,15.7740556 C13.7638894,16.9639497 13.2327518,21.156 12.1704766,21.156 Z M11.1082014,1.781 L11.1082227,1.781 C15.7930156,1.781 19.6064241,5.64507465 19.6064241,10.3921111 C19.6064241,13.8797187 17.5461945,16.881875 14.597956,18.2357569 C14.6726499,17.7711337 14.722444,17.3296635 14.7556401,16.9512483 C17.0129749,15.6559219 18.5441383,13.2025625 18.5441383,10.3917344 C18.5441383,6.2375191 15.2079569,2.85701215 11.1082121,2.85701215 C7.00846723,2.85701215 3.6722858,6.2375191 3.6722858,10.3917344 C3.6722858,13.2027778 5.20344925,15.656191 7.460784,16.9490955 C7.4939801,17.3275 7.54377425,17.7689917 7.61846813,18.2336042 C4.6702296,16.8821979 2.61,13.8798802 2.61,10.3921111 C2.61,5.64507465 6.42340855,1.781 11.1082014,1.781 Z M11.1082014,5.01011285 L11.1082014,5.01011285 C14.0377439,5.01011285 16.4195773,7.42359201 16.4195773,10.3920573 C16.4195773,12.0402778 15.6830488,13.5161146 14.5273997,14.5041858 C14.3697262,14.1846059 14.1518801,13.8944976 13.8904595,13.6380156 C14.7867542,12.8496684 15.3573022,11.6870608 15.3573022,10.3920573 C15.3573022,8.01851215 13.4506244,6.08650174 11.1082014,6.08650174 C8.76577844,6.08650174 6.85910072,8.01851215 6.85910072,10.3920573 C6.85910072,11.6871146 7.42964872,12.8496684 8.32801484,13.6401684 C8.06660485,13.8966719 7.84875877,14.1867856 7.69107464,14.5063385 C6.53335404,13.5182674 5.79682554,12.0403316 5.79682554,10.3921111 C5.79682554,7.42364583 8.17865895,5.01011285 11.1082014,5.01011285 Z"
        />
      </svg>
    ),
    title: 'Listen on Apple Podcasts',
    link: 'https://itunes.apple.com/us/podcast/egghead-io-instructor-chats/id1308497805',
  },
  {
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
      >
        <path
          fill="currentColor"
          d="M10.992,1 C5.474,1 1,5.474 1,10.992 C1,16.51 5.474,20.984 10.992,20.984 C16.51,20.984 20.984,16.51 20.984,10.992 C20.984,5.474 16.51,1 10.992,1 Z M15.34,16.683 C15.213,17.012 14.985,17.195 14.75,17.195 C14.6218364,17.1921857 14.499269,17.1419473 14.406,17.054 C12.61,15.466 10.536,15.211 9.112,15.276 C7.534,15.349 6.377,15.82 6.365,15.825 C6.002,15.975 5.625,15.651 5.526,15.101 C5.426,14.551 5.64,13.982 6.003,13.831 C6.055,13.809 7.3,13.297 9.032,13.211 C10.0153223,13.1562496 11.0009334,13.2643729 11.949,13.531 C13.1146302,13.866817 14.1898211,14.4604618 15.095,15.268 C15.421,15.557 15.531,16.19 15.34,16.683 L15.34,16.683 Z M16.61,13.62 C16.46,13.949 16.19,14.132 15.911,14.132 C15.7636009,14.1305623 15.6206986,14.0810556 15.504,13.991 C13.377,12.403 10.92,12.148 9.233,12.213 C7.363,12.286 5.993,12.757 5.98,12.762 C5.549,12.912 5.104,12.588 4.985,12.038 C4.867,11.488 5.12,10.919 5.551,10.768 C5.612,10.746 7.087,10.234 9.138,10.148 C10.346,10.097 11.508,10.205 12.594,10.468 C13.9410167,10.7881185 15.208761,11.37912 16.32,12.205 C16.706,12.493 16.836,13.127 16.61,13.62 L16.61,13.62 Z M17.392,10.624 C17.2154321,10.6236484 17.042396,10.5745062 16.892,10.482 C11.835,7.404 5.276,9.234 5.21,9.252 C4.682,9.405 4.135,9.082 3.99,8.531 C3.844,7.98 4.155,7.411 4.683,7.259 C4.759,7.237 6.568,6.725 9.083,6.639 C10.5039142,6.58350095 11.9265109,6.69086674 13.323,6.959 C15.009,7.292 16.546,7.876 17.893,8.697 C18.367,8.985 18.526,9.618 18.25,10.111 C18.0784686,10.4252071 17.7499713,10.6216164 17.392,10.624 L17.392,10.624 Z"
        />
      </svg>
    ),
    title: 'Listen on Spotify',
    link: 'https://open.spotify.com/show/4FKWy0vjNbt6uFwAzwd7XF',
  },
  {
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
      >
        <path
          fill="currentColor"
          d="M2,2 C11.941,2 20,10.059 20,20 L17,20 C17,11.716 10.284,5 2,5 L2,2 Z M2,9 C8.075,9 13,13.925 13,20 L10,20 C10,15.581722 6.418278,12 2,12 L2,9 Z M2,16 C4.209139,16 6,17.790861 6,20 L2,20 L2,16 Z"
        />
      </svg>
    ),
    title: 'Subscribe via RSS',
    link: 'https://rss.simplecast.com/podcasts/3762/rss',
  },
]

const IMAGE_SIZE = 320

const Podcast: FunctionComponent<PodcastProps> = ({
  podcast: {
    description,
    contributors,
    episode_number,
    transcript,
    title,
    image_url,
    simplecast_uid,
  },
}) => {
  return (
    <div className="container">
      <div className="w-full max-w-2xl mx-auto mb-10 leading-6">
        <div className="flex items-center justify-center">
          <div
            className="flex items-center justify-center"
            style={{clipPath: 'circle(33%)'}}
          >
            <Image
              className="absolute top-0 left-0"
              src={image_url}
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
            />
          </div>
        </div>
        <div className="leading-6 prose dark:prose-dark md:dark:prose-xl-dark md:prose-xl">
          <div className="py-4 text-sm font-light text-center text-gray-500 uppercase dark:text-gray-400">{`Episode ${episode_number} ${
            contributors && contributors.length > 0
              ? `• ${contributors.join(' && ')}`
              : ''
          }`}</div>
          <h1 className="mb-10">{title}</h1>
          <div className="sticky top-0 z-10 flex flex-col mb-10 bg-white shadow-lg sm:flex-row dark:bg-gray-900">
            <iframe
              height="52px"
              width="100%"
              frameBorder="no"
              scrolling="no"
              seamless
              src={`https://player.simplecast.com/${simplecast_uid}?dark=false`}
            ></iframe>
            <div className="flex content-center justify-center ml-2 text-gray-900">
              {LINKS.map(({link, title, image}) => (
                <a
                  key={link}
                  title={title}
                  className="flex items-center justify-center w-12 h-12 mr-2 transition-colors duration-300 ease-in-out rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {image}
                </a>
              ))}
            </div>
          </div>
          {description && <Markdown allowDangerousHtml>{description}</Markdown>}
          {transcript && <h2>Transcript</h2>}
          {transcript && <Markdown allowDangerousHtml>{transcript}</Markdown>}
        </div>
      </div>
    </div>
  )
}

export default Podcast
