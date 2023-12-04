import { Code, Container } from '@mantine/core';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import CodeBlock from '~/components/CodeBlock';
import InternalLink from '~/components/InternalLink';
import PageNavigation from '~/components/PageNavigation';
import PageText from '~/components/PageText';
import PageTitle from '~/components/PageTitle';
import PinLastColumnExample from '~/examples/PinLastColumnExample';
import readCodeExample from '~/lib/readCodeExample';

const PATH = 'examples/pinning-the-last-column';

export const getStaticProps: GetStaticProps<{
  code: string;
}> = async () => ({
  props: { code: (await readCodeExample('examples/PinLastColumnExample.tsx')) as string },
});

export default function Page({ code }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Container>
      <PageTitle of={PATH} />
      <PageText>
        You may have noticed that when you are using{' '}
        <InternalLink to="/examples/records-selection">row selection</InternalLink> and the table needs to scroll
        horizontally, the checkbox column is always visible. This is because the checkbox column is pinned to the left
        side of the table.
      </PageText>
      <PageText>
        In the same way, pinning the last column to the right side of the table could be useful when you have a table
        with many columns and you want to make sure the last column is always visible, even when the table is scrolled
        horizontally. For instance, you could use this feature to ensure that the{' '}
        <InternalLink to="/examples/row-actions-cell">row actions</InternalLink> are always visible.
      </PageText>
      <PageText>
        You can achieve this by setting the <Code>pinLastColumn</Code> DataTable prop to <Code>true</Code>:
      </PageText>
      <PinLastColumnExample />
      <PageText>Here is the code:</PageText>
      <CodeBlock language="typescript" content={code} />
      <PageText warning>
        Combining this feature with <InternalLink to="/examples/column-grouping">column grouping</InternalLink> may lead
        to minor visual artifacts.
      </PageText>
      <PageText>Head over to the next example to discover more features.</PageText>
      <PageNavigation of={PATH} />
    </Container>
  );
}
