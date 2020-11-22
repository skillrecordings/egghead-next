import axios from 'axios'

export async function loadCurrentUser(
  token: string,
  loadFullUser: boolean = true,
) {
  const user = await axios
    .get(`/api/users/current?minimal=${loadFullUser}`)
    .then(({data}) => data)

  return user
}
