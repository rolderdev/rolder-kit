declare module "@noodl/noodl-sdk" {
    function defineModule(def: {
        reactNodes?: ReactNodeDef[]
        nodes?: any
        settings?: NodePort[]
    }): void
}
