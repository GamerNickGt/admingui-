import axios from 'axios'
import { IpcMain } from 'electron'

async function InitializeContributors(f: IpcMain) {
  const contributor_enpoint = 'https://api.github.com/repos/defsak/admin-gui/contributors'

  let contributors: any[] = []
  try {
    const { data } = await axios.get(contributor_enpoint)
    contributors = data
  } catch (e) {
    console.error(e)
  }

  f.handle('fetch_contributors', () => {
    return contributors
  })
}

export default InitializeContributors
