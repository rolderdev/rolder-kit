import { BaseReactProps } from "@packages/node";
import type { MantineSize, NavbarProps } from "@mantine/core";

export type Props = BaseReactProps & {
  navbarWithBorder?: boolean;
  navbarWidth: NavbarProps["width"];
  navbarHiddenBreakpoint?: MantineSize;
};
