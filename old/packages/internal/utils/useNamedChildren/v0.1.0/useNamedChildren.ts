export default function (children: any, noodlNodeNames: string[]) {
  let matchedChildren: Record<string, any> = {};
  let restChildren: any = [];

  try {
    const ch = Array.isArray(children) ? children : [children];
    for (const child of ch) {
      const childNodeName = child?.props?.noodlNode?.model.type.split(".")[1];
      if (childNodeName) {
        if (noodlNodeNames.includes(childNodeName))
          matchedChildren[childNodeName] = child;
        else restChildren.push(child);
      } else restChildren.push(child);
    }
  } catch (error) {
    log.error("Error at getNamedChildren: ", error);
  }

  return { matchedChildren, restChildren };
}
