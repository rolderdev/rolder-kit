import type { Item } from "types";
import type { TableProps } from "../../types";
import getGuid from "@packages/get-guid";
import type { NoodlNode } from "@packages/node";

export default async (
  noodlNode: NoodlNode,
  expansion: TableProps["expansion"],
  items: Item[],
  recordIds: string[],
  expansionRowNodes: { id: string; rowRender: any }[]
): Promise<{ id: string; rowRender: any }[]> => {
  const newRecordIds = recordIds.filter(
    (i) => !expansionRowNodes.map((i) => i.id).includes(i)
  );
  const deletedRecordIds = expansionRowNodes
    .map((i) => i.id)
    .filter((i) => !recordIds.includes(i));
  const newExpansionRowNodes = await Promise.all(
    newRecordIds.map((newRecordId) => {
      const item = items.find((i) => i.id === newRecordId);
      if (item) {
        const group = noodlNode.nodeScope.createPrimitiveNode("Group");
        group.setStyle({ flex: "1 0 100%" });
        return noodlNode.nodeScope
          .createNode(expansion.template, getGuid(), {
            _forEachModel: window.Noodl.Object.create(item),
            _forEachNode: noodlNode,
          })
          .then((node: any) => {
            group.addChild(node);
            return { id: item.id, rowRender: group.render() };
          });
      }
    })
  );

  return [
    ...expansionRowNodes.filter((i) => !deletedRecordIds.includes(i.id)),
    ...newExpansionRowNodes,
  ];
};
