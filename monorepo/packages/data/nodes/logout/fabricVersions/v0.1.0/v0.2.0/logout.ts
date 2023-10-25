export default {
  signals: {
    logout: () => {
      window.R.libs.Kuzzle.auth.logout().then(() => window.location.reload())
    }
  }
}