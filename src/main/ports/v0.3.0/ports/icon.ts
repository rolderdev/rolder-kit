const units = ['rem', '%', 'px']

const icon = [
    { name: 'iconName', group: 'Icon', type: 'string', displayName: 'Icon name', tooltip: 'Find icon at tabler-icons.io and capitalize it: "IconSuperName"' },
    { name: 'iconSize', group: 'Icon', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Icon size' },
    { name: 'stroke', group: 'Icon', type: 'number', displayName: 'Stroke' },
] as const satisfies readonly NodePort2[];

export default icon