export function log(message: string, value?: any) {
    const { debug } = window.R.states
    if (debug > 1) {
        if (value) {
            console.groupCollapsed(`%c${message}`, 'color: #9CB1FC')
            console.dir(value, { howProxy: true })
            console.groupEnd()
        } else console.log(`%c${message}`, 'color: #9CB1FC')
    }
}

export function time(message: string, end?: boolean) {
    const { debug } = window.R.states

    if (debug > 0) {
        if (end) console.timeEnd(`${message} time`)
        else console.time(`${message} time`)

    }
}