import { BaseReactProps } from "@packages/node";
import type { HeaderProps, MantineNumberSize } from "@mantine/core";

export type Props = BaseReactProps & {
  headerWithBorder?: boolean;
  headerHeight: HeaderProps["height"];
  burgerSize?: MantineNumberSize;
};
