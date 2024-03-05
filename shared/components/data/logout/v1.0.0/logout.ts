import { getKuzzle } from '@shared/get-kuzzle';

export default {
  logout() {
    const K = getKuzzle()
    if (!K) { return null }

    K.auth.logout().then(() => window.location.replace(window.location.origin))
  }
}