import axios, { AxiosError } from 'axios'

async function API<T>(url: string): Promise<APIResponse<T | null>> {
  try {
    const { data, status } = await axios.get<T>(url)
    return { status, ok: status === 200, data: status === 200 ? data : null }
  } catch (e) {
    const error = e as AxiosError
    const status = error.response?.status || -1
    return { status, ok: false, data: null }
  }
}

function APIHandler<T>(
  ident: APIEndpoint,
  url: string
): [string, (event: any, args: any[]) => Promise<APIResponse<T | null>>] {
  return [
    ident,
    async (_, args) => {
      return await API<T>(url.format(...args))
    }
  ]
}

String.prototype.format = function (): string {
  const args = arguments
  return this.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match
  })
}

const API_URL = 'https://chivalry2stats.com:8443'

export function InitializeAPIHandlers(f: Function) {
  f(...APIHandler<PlayFabDetails>('fetch_playfab_data', `${API_URL}/players/{0}`))
  f(
    ...APIHandler<PlayerDetails>(
      'fetch_player_data',
      `${API_URL}/players/fetch-all-leaderboards-around-player/{0}?distinctId=undefined`
    )
  )
  f(
    ...APIHandler<NameLookup>(
      'name_lookup',
      `${API_URL}/players/search?searchTerm={0}&page={1}&pageSize={2}&distinctId=undefined`
    )
  )
}
