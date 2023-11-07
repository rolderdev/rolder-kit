import useData from '../../../libs/use-data/v0.1.0/use-data'
import { classVersion, dbVersion } from '../../../utils/data/v.0.1.0/data'

export default function node() {
    const { classes, debug } = Rolder

    if (classes) {
        let subscribedClasses = []
        Object.keys(classes).forEach(className => {
            if (classes[className].subscribe) {
                const index = dbVersion()
                const classNameV = classVersion(className)

                Kuzzle.realtime.subscribe(index, classNameV, {},
                    notif => {
                        if (notif.type !== 'document') return
                        if (debug > 1) console.log('new ' + classNameV + ' recieved:', notif.result)
                        useData.invalidate({ className })
                    }
                )
                subscribedClasses.push(classNameV)
            }
        })
        if (debug > 1) console.log('Subscribed to: ', subscribedClasses)
    }
}