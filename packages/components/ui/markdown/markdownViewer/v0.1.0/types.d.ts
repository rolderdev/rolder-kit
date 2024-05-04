import { BaseReactProps } from "@packages/node";
import { Gantt, Task, ViewMode } from "./src/lib";

export type Props = BaseReactProps & {
  markdown?: string;
};
