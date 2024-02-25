const fetchRemote = (resolve) => {
  const script = document.createElement("script")
  const version = R.env.rolderKit
  const path = version.replaceAll('.', '_').replaceAll('-', '_')
  const subDomain = version.replaceAll('.', '-')
  script.src = R.states.devMode
    ? `http://localhost:8080/${path}/remoteEntry.js`
    : `https://${subDomain}.mfe.rolder.app/${path}/remoteEntry.js`
  if (!window.offlineMode) {
    script.onload = () => {
      const module = {
        get: (request) => window.remote.get(request),
        init: (arg) => {
          try {
            return window.remote.init(arg);
          } catch (e) {
            console.log("Remote has already been loaded");
          }
        },
      };
      resolve(module);
    }

    document.head.appendChild(script);
  }
}

module.exports = fetchRemote