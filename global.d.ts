declare var R: Rolder
declare var Noodl: any
declare var offlineMode: boolean
declare var remote: any

declare var log: {
    start(): number
    end(title: string, startTime: number): void
    info(title: string, ...args): void
    error(title: string, ...args): void
}