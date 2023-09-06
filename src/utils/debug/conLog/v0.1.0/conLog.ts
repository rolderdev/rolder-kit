export default function (message: string | string[], type: 'time' | 'timeEnd') {
    const { debug } = window.Rolder
    if (debug > 0) {
        if (type === 'time') console.time(`${message} time`)
    }
}