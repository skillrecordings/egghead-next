import {NextApiRequest, NextApiResponse} from 'next'
import {Client, GuildMember, User, Guild} from 'discord.js'
import {Viewer} from 'interfaces/viewer'
import got from 'got'
import {getTokenFromCookieHeaders} from 'utils/auth'

const EGGHEAD_AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN
const DISCORD_API_BASE = process.env.DISCORD_API_BASE
const DISCORD_MEMBER_ROLE_ID = process.env.DISCORD_EGGHEAD_MEMBER_ROLE_ID
const DISCORD_GUILD_ID = process.env.NEXT_PUBLIC_DISCORD_GUILD_ID
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
const DISCORD_SCOPES = process.env.DISCORD_SCOPES
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
const DISCORD_REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI

function safeParse(string: string) {
  try {
    return JSON.parse(string)
  } catch (error) {
    return string
  }
}

function handleGotError(error: any) {
  error.statusCode = error.response.statusCode
  try {
    const body = safeParse(error.response.body)
    error.body = body
    error.message = JSON.stringify(body, null, 2) || error.message
  } catch {
    // ignore
  }
  return error
}

type InviteParams = {
  discordUserId: string
  discordUserToken: string
}

async function inviteToServer({discordUserId, discordUserToken}: InviteParams) {
  const joinGuildUrl = `${DISCORD_API_BASE}/guilds/${DISCORD_GUILD_ID}/members/${discordUserId}`

  const status = await got
    .put(joinGuildUrl, {
      json: {access_token: discordUserToken},
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      hooks: {beforeError: [handleGotError]},
    })
    .json()

  return status
}

async function loadDiscordUser(code: string) {
  const discordParams = {
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: DISCORD_REDIRECT_URI,
    scope: DISCORD_SCOPES,
  }
  const discordToken: any = await got
    .post(`${DISCORD_API_BASE}/oauth2/token`, {
      form: discordParams,
      hooks: {beforeError: [handleGotError]},
    })
    .json()

  const discordUser: User = await got
    .get(`${DISCORD_API_BASE}/users/@me`, {
      responseType: 'json',
      headers: {
        authorization: `${discordToken.token_type} ${discordToken.access_token}`,
      },
      hooks: {beforeError: [handleGotError]},
    })
    .json()

  return {discordUser, discordToken}
}

async function fetchEggheadUser(token: string) {
  const current: Viewer = await got
    .get(`${EGGHEAD_AUTH_DOMAIN}/api/v1/users/current`, {
      responseType: 'json',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      hooks: {beforeError: [handleGotError]},
    })
    .json()

  return current
}

type UpdateDiscordUserForEggheadParams = {
  discordMember: GuildMember
  eggheadUser: Viewer
  eggheadToken: string
}

async function updateDiscordRolesForEggheadUser({
  discordMember,
  eggheadUser,
  eggheadToken,
}: UpdateDiscordUserForEggheadParams) {
  if (discordMember && eggheadUser) {
    const updateEgghead: Viewer = await got
      .put(`${EGGHEAD_AUTH_DOMAIN}/api/v1/users/${eggheadUser.id}`, {
        responseType: 'json',
        json: {
          user: {discord_id: discordMember.id},
        },
        headers: {
          Authorization: `Bearer ${eggheadToken}`,
        },
        hooks: {beforeError: [handleGotError]},
      })
      .json()

    if (updateEgghead.is_pro && DISCORD_MEMBER_ROLE_ID) {
      await discordMember.roles.add(DISCORD_MEMBER_ROLE_ID)
    } else if (DISCORD_MEMBER_ROLE_ID) {
      await discordMember.roles.remove(DISCORD_MEMBER_ROLE_ID)
    }

    return updateEgghead
  } else {
    throw new Error(`requires egghead and discord users to ipdate`)
  }
}

async function getDiscordBotClient() {
  const client = new Client()
  await client.login(DISCORD_BOT_TOKEN)
  return client
}

async function fetchOrInviteDiscordMember(
  client: Client,
  discordUser: User,
  discordToken: any,
): Promise<GuildMember> {
  const guild: Guild | undefined = client.guilds.cache.get(
    DISCORD_GUILD_ID as string,
  )
  if (guild) {
    const discordMember: GuildMember = await guild.members
      .fetch(discordUser.id)
      .catch(async (e) => {
        await inviteToServer({
          discordUserId: discordUser.id,
          discordUserToken: discordToken.access_token,
        })

        const newMember = await fetchOrInviteDiscordMember(
          client,
          discordUser,
          discordToken,
        )
        return newMember
      })

    return discordMember
  } else {
    throw new Error('no discord guild was found')
  }
}

const discord = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const client = await getDiscordBotClient()
      const {discordUser, discordToken} = await loadDiscordUser(req.body.code)
      const {eggheadToken} = getTokenFromCookieHeaders(
        req.headers.cookie as string,
      )

      if (discordUser && eggheadToken) {
        const discordMember: GuildMember = await fetchOrInviteDiscordMember(
          client,
          discordUser,
          discordToken,
        )

        const eggheadUser: Viewer = await fetchEggheadUser(eggheadToken)

        await updateDiscordRolesForEggheadUser({
          discordMember,
          eggheadUser,
          eggheadToken,
        })

        const phrase = phraseFromUsername(`<@${discordMember.id}>`)
        const channel = client.channels.cache.get('754437688769249371') as any

        if (channel.send) channel.send(`_${phrase}_`)

        res.status(200).json({
          discordUser,
          discordMember,
          eggheadUser,
        })
      } else {
        res.status(405).end(`requires discord user and egghead auth token`)
      }
    } catch (error) {
      res.status(500).json(error)
    }
  } else {
    res.statusCode = 404
    res.end()
  }
}

export default discord

function phraseFromUsername(username: string) {
  const phrases = [
    `${username} just joined the server - glhf!`,
    `${username} just joined. Everyone, look busy!`,
    `${username} just joined. Can I get a heal?`,
    `${username} joined your party.`,
    `${username} joined. You must construct additional pylons.`,
    `Ermagherd. ${username} is here.`,
    `Welcome, ${username}. Stay awhile and listen.`,
    `Welcome, ${username}. We were expecting you ( ͡° ͜ʖ ͡°)`,
    `Welcome, ${username}. We hope you brought pizza.`,
    `Welcome ${username}. Leave your weapons by the door.`,
    `A wild ${username} appeared.`,
    `Swoooosh. ${username} just landed.`,
    `Brace yourselves. ${username} just joined the server.`,
    `${username} just joined. Hide your bananas.`,
    `${username} just arrived. Seems OP - please nerf.`,
    `${username} just slid into the server.`,
    `A ${username} has spawned in the server.`,
    `Big ${username} showed up!`,
    `Where’s ${username}? In the server!`,
    `${username} hopped into the server. Kangaroo!!`,
    `${username} just showed up. Hold my beer.`,
    `Challenger approaching - ${username} has appeared!`,
    `It's a bird! It's a plane! Nevermind, it's just ${username}.`,
    `It's ${username}! Praise the sun! \\\\[T]/`,
    `Never gonna give ${username} up. Never gonna let ${username} down.`,
    `Ha! ${username} has joined! You activated my trap card!`,
    `Cheers, love! ${username}'s here!`,
    `Hey! Listen! ${username} has joined!`,
    `We've been expecting you ${username}`,
    `It's dangerous to go alone, take ${username}!`,
    `${username} has joined the server! It's super effective!`,
    `Cheers, love! ${username} is here!`,
    `${username} is here, as the prophecy foretold.`,
    `${username} has arrived. Party's over.`,
    `Ready player ${username}`,
    `${username} is here to kick butt and chew bubblegum. And ${username} is all out of gum.`,
    `Hello. Is it ${username} you're looking for?`,
    `${username} has joined. Stay a while and listen!`,
    `Roses are red, violets are blue, ${username} joined this server with you`,
  ]

  return phrases[Math.floor(Math.random() * phrases.length)]
}
