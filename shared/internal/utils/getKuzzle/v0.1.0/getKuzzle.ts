export function getKuzzle() {
    const { Kuzzle } = R.libs
    if (!Kuzzle) {
        R.libs.mantine?.MantineError('Системная ошибка!', `No Kuzzle instance at R.libs`)
        log.error('No Kuzzle instance', R.libs); return false
    } else return Kuzzle
}