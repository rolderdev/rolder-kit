export default function (dbClass: string, options: Options) {
    const defaultOptions = eval(window.Noodl.getProjectSettings().dbClasses)?.[0][dbClass]?.defaults?.options
    const subscribe = !window.Noodl.Objects[dbClass].subscribe && { refresh: 'wait_for' }
    return { ...defaultOptions, ...subscribe, ...options, lang: 'koncorde' }
}