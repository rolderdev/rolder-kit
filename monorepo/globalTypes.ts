declare module "@noodl/noodl-sdk" {
    function defineModule(def: {
        reactNodes?: ReactNodeDef[]
        nodes?: any
        settings?: NodePort[]
    }): void
    function defineNode(n: any): void
}
declare module 'numbro/dist/languages/ru-RU.min.js';