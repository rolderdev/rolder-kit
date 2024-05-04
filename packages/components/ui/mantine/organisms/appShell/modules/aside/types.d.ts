import { BaseReactProps } from "@packages/node";
import type { AsideProps, MantineSize } from "@mantine/core";

export type Props = BaseReactProps & {
  asideWithBorder?: boolean;
  asideWidth: AsideProps["width"];
  asideHiddenBreakpoint?: MantineSize;
};
