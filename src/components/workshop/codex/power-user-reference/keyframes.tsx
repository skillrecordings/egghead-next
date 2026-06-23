'use client'
import * as React from 'react'
import Image from 'next/image'
import {KEYFRAMES} from './content'

const BASE = '/workshop/codex/power-user/keyframes'

export default function Keyframes() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {KEYFRAMES.map((frame) => (
        <figure
          key={frame.file}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-smooth dark:border-gray-800 dark:bg-gray-950/40"
        >
          <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-900">
            <Image
              src={`${BASE}/${frame.file}`}
              alt={frame.caption}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <figcaption className="flex items-start gap-3 px-4 py-3 text-sm">
            <span className="mt-0.5 shrink-0 rounded bg-blue-600 px-2 py-0.5 font-mono text-xs font-semibold text-white">
              {frame.time}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              {frame.caption}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
