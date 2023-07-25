export default function parsePath(navItems, path) {
    let navbarItem = {}, headerItem = {}, headerItems = []
    const navItemByPath = navItems.find(i => i.path === path)
    if (navItemByPath) {
        const itemPathElems = navItemByPath.path.split('/')
        if (itemPathElems.length === 2) {
            navbarItem = navItemByPath
            headerItem = navItems.find(i => i.path.split('/').length === 3 && i.path.split('/').includes(itemPathElems[1]) && i.default)
            headerItems = navItems.filter(i => i.path.split('/').length === 3 && i.path.split('/').includes(itemPathElems[1]))
        } else if (itemPathElems.length === 3) {
            navbarItem = navItems.find(i => i.path.split('/').length === 2 && i.path.split('/').includes(itemPathElems[1]))
            headerItem = navItemByPath
            headerItems = navItems.filter(i => i.path.split('/').length === 3 && i.path.split('/').includes(itemPathElems[1]))
        }
    } else {
        navbarItem = navItems.find(i => i.path.split('/').length === 2 && i.default)
        headerItem = navItems.find(i => i.path.split('/').length === 3 && i.path.split('/').includes(navbarItem.path.split('/')[1]) && i.default)
        headerItems = navItems.filter(i => i.path.split('/').length === 3 && i.path.split('/').includes(headerItem.path.split('/')[1]))
    }

    return { navbarItem, headerItem, headerItems }
}