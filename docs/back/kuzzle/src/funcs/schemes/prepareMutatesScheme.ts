import { MutateScheme } from '../../types'

export default function prepareScheme(baseSchemes: MutateScheme[]): MutateScheme[] {
  return baseSchemes.map(baseScheme => {    
    if (baseScheme.itemsFunc) {
      try { return { ...baseScheme, itemsEvalFunc: eval(baseScheme.itemsFunc) } }
      catch (e) { console.error("Items eval func error", e) }
    } else return baseScheme
  })
}
