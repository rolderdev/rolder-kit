import { Provider, createStore } from "jotai"
import { forwardRef, useState } from "react"
import BounceLoader from "react-spinners/BounceLoader"

const store = createStore()

export default forwardRef(function (props: any) {
    const { cookies } = window.R.libs
    const { project, projectVersion } = window.Noodl.getProjectSettings()

    if (projectVersion) {
        const cookieProjectVersion = cookies.get('projectVersion')
        if (!cookieProjectVersion) cookies.set('projectVersion', projectVersion)
        else if (projectVersion !== cookieProjectVersion) {
            cookies.set('projectVersion', projectVersion)
            window.location.reload()
        }
    }

    window.R.env.project = project
    window.R.env.projectVersion = projectVersion
    window.R.params.defaults = props.projectDefaults
    
    const [backendInited, setBackendInited] = useState(false)

    window.Noodl.Events.on("backendInited", () => setBackendInited(true))

    return <>
        <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-30px', marginLeft: '-30px' }}>
            <BounceLoader
                color={props.appLoaderColor}
                loading={!backendInited}
            />
        </div>
        {window.R.env.project && <Provider store={store}>{props.children}</Provider>}
    </>
})