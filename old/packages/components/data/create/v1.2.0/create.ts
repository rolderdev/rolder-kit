import type { CreateScheme, Props } from './types';
import { sendOutput, sendSignal } from '@packages/port-send';
import clone from 'just-clone';
import { dbClassVersion } from '@packages/get-dbclass-version';


// Проверяем указан ли dbClass
function getCreateScheme(createScheme: CreateScheme): CreateScheme | boolean {
  let resultScheme: CreateScheme = clone(createScheme)
  resultScheme.forEach(dbClassScheme => {

    // Получаем dbClass с версией
    const dbClass = dbClassVersion(dbClassScheme.dbClass)

    // Заменяем в схеме dbClass без версии классом с версией
    if (dbClass) dbClassScheme.dbClass = dbClass
    // Если нет dbClass с версией, то выдаем ошибку, что dbClass не найден
    else {
      R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbClass at scheme: ${JSON.stringify(dbClassScheme)}`)
      log.error('`No dbClass at scheme', dbClassScheme)
      return false
    }
    // Если нет записей или функции на обновление, то выдаем ошибку
    if (!dbClassScheme.items && !dbClassScheme.itemsFunc) {
      R.libs.mantine?.MantineError?.('Системная ошибка!', `No items or itemsFunc at scheme: ${JSON.stringify(dbClassScheme)}`)
      log.error('No items or itemsFunc at scheme', dbClassScheme)
      return false
    }
    return
  })

  return resultScheme
}

export default {
  async create(props: Props) {

    // Получаем схему, у которой класс указан с версией
    const scheme = getCreateScheme(props.scheme)

    // Ставим флаг о том, что началось обновление
    sendOutput(props.noodlNode, 'creating', true)

    // Фиксируем время начала
    const startTime = log.start()
    log.info(`create props`, { scheme })

    try {
      // Создаем записи
      // const data = R.libs.mutate && await R.libs.mutate({ action: 'create', scheme, silent: props.silent })

      if (Array.isArray(scheme)) {

        // const startTime2 = new Date()

        // Задаем размер чанка
        const chunkSize = 100
        // Задаем корзину, в которой будем хранить записи, наполняя до джостижения размера чанка
        const chunkBox: {
          dbClass: string,
          items: any[]
        }[] = []
        let chunkData = []
        // Задаем объект, хранящий результаты создания записей
        const createResult: {
          [dbClass: string]: {
            count?: number;
            error?: string;
            items?: object[];
          }
        } = {}

        // Отщипываем крайний объект первого класса
        const endItem = scheme?.[0]?.items?.pop()

        // let countItems = 0

        // Перебираем схемы классов
        for (const iScheme of scheme) {

          // Создаем записи по частям
          if (iScheme?.items) {

            // Перебираем записи, и при достижении размера чанка создаем запись
            for (const item of iScheme?.items) {
              chunkData.push(item)
              if (chunkData.length === chunkSize) {
                chunkBox.push({
                  dbClass: iScheme.dbClass,
                  items: chunkData
                })
                // Очищаем чанк для следующих записей
                chunkData = []
              }
            }

            // Если после перебора остались не созданные записи
            if (chunkData.length > 0) {
              chunkBox.push({
                dbClass: iScheme.dbClass,
                items: chunkData
              })
              // Очищаем чанк для следующих записей
              chunkData = []
            }

          }
        }

        // После того, как мы нарезали схемы классов на чанки, создаем их, но асинхронно
        await Promise.all(chunkBox?.map(async iChunk => {
          // Создаем записи из chunk
          const data = R.libs.mutate && await R.libs.mutate({
            action: 'create',
            scheme: [{
              dbClass: iChunk.dbClass,
              items: iChunk.items
            }],
            silent: true,
            refresh: "false"
          })

          // Добавляем результаты
          for (const dbClass in data) {
            if (createResult?.[dbClass] === undefined) {
              createResult[dbClass] = {
                count: 0,
                items: []
              }
            }
            const count = createResult[dbClass]?.count || 0
            const iCount = data[dbClass]?.count || 0
            createResult[dbClass].count = count + iCount

            if (data?.[dbClass]?.items) {
              createResult[dbClass].items = createResult[dbClass]?.items?.concat(data[dbClass].items)
            }

            if (data?.[dbClass]?.error) {
              createResult[dbClass].error = data[dbClass].error
            }
          }
        }))

        // Создаем крайний item, чтобы затриггерить useData, еслы silent: false
        const endCreateReasult = R.libs.mutate && await R.libs.mutate({
          action: 'create',
          scheme: [{
            dbClass: scheme?.[0]?.dbClass,
            items: [endItem]
          }],
          silent: props.silent, // Крайний silent берем уже из параметров ноды
          refresh: "wait_for"
        })

        // Добавляем результаты
        for (const dbClass in endCreateReasult) {
          if (createResult?.[dbClass]?.count === undefined) {
            createResult[dbClass] = {
              count: 0,
              items: []
            }
          }
          const count = createResult[dbClass]?.count || 0
          const iCount = endCreateReasult[dbClass]?.count || 0
          createResult[dbClass].count = count + iCount

          if (endCreateReasult?.[dbClass]?.items !== undefined) {
            createResult[dbClass].items = createResult[dbClass]?.items?.concat(endCreateReasult[dbClass].items)
          }

          if (endCreateReasult?.[dbClass]?.error) {
            createResult[dbClass].error = endCreateReasult[dbClass].error
          }
        }

        // Подаем на выход результат и снимаем флаг о создании записей
        //@ts-ignore
        sendOutput(props.noodlNode, `data`, createResult)
        sendOutput(props.noodlNode, 'creating', false)
        sendSignal(props.noodlNode, 'created')

        log.info(`created`, createResult)
        log.end(`create`, startTime)
      }


    } catch (error: any) {
      R.libs.mantine?.MantineError?.('Системная ошибка!', `create error: ${error.message}`)
      log.error('create error', error)
    }
  }
}