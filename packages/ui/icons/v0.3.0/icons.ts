import * as icons from './src/icons'
export default icons
export const hasIcon = (name: string) => {
  const i = icons as any
  if (i[name]) return true
  else return false
}