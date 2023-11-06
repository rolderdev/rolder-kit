export default function (message: string | any[], type?: 'time' | 'timeEnd') {
    const { debug } = window.Rolder
    if (debug > 0) {
        switch (type) {
            case 'time': console.time(`${message} time`); break
            case 'timeEnd': console.timeEnd(`${message} time`); break
        }
    }
    if (debug > 1 && !type) {
        if (Array.isArray(message)) {
            console.groupCollapsed(...message)
            console.groupEnd()
        } else console.log(message)
    }
}