/** @jsx jsx */
import React, {useRef, useState, useEffect} from 'react'
import {gsap} from 'gsap/dist/gsap'
import {bpMaxMD} from '../../../../utils/breakpoints.js'
import {jsx} from '@emotion/core'
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function DOMScroller({children}) {
  const triggerRef = useRef(null)
  const codeBox = useRef(null)
  const img1 = useRef(null)
  const img2 = useRef(null)
  const img3 = useRef(null)
  const img4 = useRef(null)
  // const imageRef = useRef(null)
  // const [isLoaded, setIsLoaded] = useState(false)

  const altText =
    'An HTML document going into a browser and rendering as node elements on the DOM'

  const imageStyle = {
    position: 'absolute',
    opacity: 0,
    top: 0,
    maxWidth: '100%',
    [bpMaxMD]: {
      display: 'none',
    },
  }

  useEffect(() => {
    ScrollTrigger.matchMedia({
      '(min-width: 1024px)': function () {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: [triggerRef.current],
            start: 'top top',
            scrub: true,
            pin: true,
          },
        })

        timeline
          .to([codeBox.current], {
            duration: 1,
            opacity: 0,
          })
          .to([img1.current], {
            duration: 1,
            x: '268px',
            y: '-65px',
            scale: 0.9,
          })
          .to([img2.current], {
            duration: 1,
            opacity: 1,
          })
          .to([img3.current], {
            duration: 2,
            opacity: 1,
          })
          .to([img4.current], {
            duration: 2,
            opacity: 1,
          })
      },
    })
  }, [])

  return (
    <div
      ref={triggerRef}
      css={{
        maxWidth: '820px',
        margin: '0 auto',
        position: 'relative',
        height: '170vh',
        marginBottom: '-75vh',
        [bpMaxMD]: {
          height: 'auto',
          marginBottom: 0,
        },
      }}
    >
      <div
        css={{
          display: 'flex',
          position: 'absolute',
          top: '40px',
          margin: '0 auto',
          zIndex: 3,
          width: '110%',
          marginLeft: '-5%',
          [bpMaxMD]: {
            display: 'none',
          },
        }}
      >
        <img
          ref={img1}
          css={{
            margin: '0 1em',
            justifyContent: 'flex-start',
            objectFit: 'contain',
            maxWidth: '300px',
          }}
          src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1599817004/egghead-next-ebombs/wtf-DOM/dom1.jpg"
        />
        <span ref={codeBox} css={{width: '100%', marginLeft: '2em'}}>
          {children}
        </span>
      </div>
      <img
        ref={img2}
        css={{
          ...imageStyle,
          zIndex: 0,
        }}
        src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1599816716/egghead-next-ebombs/wtf-DOM/dom2.jpg"
      />
      <img
        ref={img3}
        css={{
          ...imageStyle,
          zIndex: 1,
        }}
        src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1599816717/egghead-next-ebombs/wtf-DOM/dom3.jpg"
      />
      <img
        alt={altText}
        ref={img4}
        css={{
          ...imageStyle,
          zIndex: 2,
          [bpMaxMD]: {
            position: 'relative',
            display: 'block',
            opacity: 1,
            maxWidth: '100%',
            margin: '0 auto',
            padding: '0 2em',
          },
        }}
        src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1600084432/egghead-next-ebombs/wtf-DOM/dom4.jpg"
      />
    </div>
  )
}
