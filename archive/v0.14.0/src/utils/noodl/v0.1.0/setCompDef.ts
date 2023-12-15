export default function setCompDef(funcProps: { compDef: any, localProps: any, props: any, recreate: boolean, compVersions: CompVersions }) {
    const { compDef, localProps, props, recreate, compVersions } = funcProps

    if (recreate) return {
        props: { style: props.style, styles: props.styles, children: props.children, ...localProps },
        Comp: compVersions[localProps.version]?.Comp
    }
    else return {
        props: { ...compDef.props, ...localProps },
        Comp: compDef.Comp
    }
}