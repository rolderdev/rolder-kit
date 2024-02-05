export default {
  signals: {
    logout: () => {
      window.R.env.project
      window.R.libs.Kuzzle.auth.logout().then(() => window.location.replace(window.location.origin))
    }
  }
}