import axios from 'axios'

export async function loadCurrentUser(
  token: string,
  loadFullUser: boolean = true,
) {
  const user = await axios
    .get(
      `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/users/current?minimal=${loadFullUser}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(({data}) => data)

  return user
}
