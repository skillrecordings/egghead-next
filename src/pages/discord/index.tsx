import Link from 'next/link'
import React from 'react'

const Discord = () => {
  return (
    <>
      {process.env.NEXT_PUBLIC_DISCORD_AUTHORIZE && (
        <Link href={process.env.NEXT_PUBLIC_DISCORD_AUTHORIZE}>
          <a>Sync your Discord to egghead</a>
        </Link>
      )}
    </>
  )
}

export default Discord
