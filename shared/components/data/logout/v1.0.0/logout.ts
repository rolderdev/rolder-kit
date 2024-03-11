import { getKuzzle } from '@shared/get-kuzzle';

export default {
  async logout() {
    const K = await getKuzzle()
    if (!K) { return null }

    K.auth.logout().then(() => window.location.replace(window.location.origin))
  }
}