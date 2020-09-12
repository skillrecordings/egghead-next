import axios from 'axios'
import Discord from 'discord.js'
import queryString from 'query-string'
import * as cookie from 'cookie'

import {NextApiRequest, NextApiResponse} from 'next'

const api_base = `https://discord.com/api`

async function loadDiscordUser(code: string) {
  const discordParams = {
    client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI,
    scope: process.env.DISCORD_SCOPES,
  }
  const discordHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  const tokenResponse = await axios
    .post(`${api_base}/oauth2/token`, queryString.stringify(discordParams), {
      headers: discordHeaders,
    })
    .then(({data}) => data)

  const discordUser = await axios
    .get(`${api_base}/users/@me`, {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    })
    .then(({data}) => data)

  const joinGuildUrl = `${api_base}/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordUser.id}`

  await axios
    .put(
      joinGuildUrl,
      {access_token: tokenResponse.access_token},
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      },
    )
    .catch(() => console.error('no join'))

  return discordUser
}

async function fetchEggheadUser(token: string) {
  const current = await axios
    .get(`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/users/current`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({data}) => data)

  return current
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const eggheadToken = cookie.parse(req.headers.cookie as string)
      .egghead_sellable_access_token

    const memberRole = '715324660384006216'
    const client = new Discord.Client()
    await client.login(process.env.DISCORD_BOT_TOKEN)
    const discordUser = await loadDiscordUser(req.body.code)
    var guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID as string)
    var member = await guild?.members.fetch(discordUser.id)
    const egghead = await fetchEggheadUser(eggheadToken)

    if (member && egghead) {
      const updateEgghead = await axios
        .put(
          `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/users/${egghead.id}`,
          {
            user: {discord_id: member.id},
          },
          {
            headers: {
              Authorization: `Bearer ${eggheadToken}`,
            },
          },
        )
        .then(({data}) => data)

      if (updateEgghead.is_pro) {
        await member.roles.add(memberRole)
      } else {
        await member.roles.remove(memberRole)
      }
    }

    res.json({member, egghead})
  } else {
    res.statusCode = 404
    res.end()
  }

  // console.log(req.headers)
}
