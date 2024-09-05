import { BaseReactProps } from "@packages/node";
import type { FooterProps } from "@mantine/core";

export type Props = BaseReactProps & {
  footerWithBorder?: boolean;
  footerHeight: FooterProps["height"];
};
