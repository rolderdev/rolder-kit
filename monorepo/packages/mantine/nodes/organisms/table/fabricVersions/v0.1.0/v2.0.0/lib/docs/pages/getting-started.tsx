import { Code, Container } from '@mantine/core';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import CodeBlock from '~/components/CodeBlock';
import CodeFiles from '~/components/CodeBlockTabs';
import ExternalLink from '~/components/ExternalLink';
import InternalLink from '~/components/InternalLink';
import PageNavigation from '~/components/PageNavigation';
import PageText from '~/components/PageText';
import PageTitle from '~/components/PageTitle';
import GettingStartedExample from '~/examples/GettingStartedExample';
import { getFirstExamplePagePath } from '~/lib/page';
import readCodeExample from '~/lib/readCodeExample';

const PATH = 'getting-started';

export const getStaticProps: GetStaticProps<{ code: string }> = async () => ({
  props: { code: (await readCodeExample('examples/GettingStartedExample.tsx')) as string },
});

export default function Page({ code }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Container>
      <PageTitle of={PATH} />
      <PageText>
        If you&apos;re using Next.js, Vite, Create React App, Remix or Gatsby, make sure to have a look at{' '}
        <ExternalLink to="https://mantine.dev/pages/getting-started/">Getting started with Mantine</ExternalLink> page.
      </PageText>
      <PageText>
        Mantine DataTable depends on <Code>@mantine/core</Code> and <Code>@mantine/hooks</Code>.
        <br />
        Mantine also depends on <Code>@emotion/react</Code> (and <Code>@emotion/server</Code> when used with SSR
        frameworks).
        <br />
      </PageText>
      <PageText>Install the package and its dependencies:</PageText>
      <CodeFiles
        items={[
          {
            title: 'yarn',
            language: 'bash',
            content: 'yarn add @mantine/core@6 @mantine/hooks@6 @emotion/react mantine-datatable@6',
          },
          {
            title: 'pnpm',
            language: 'bash',
            content: 'pnpm i @mantine/core@6 @mantine/hooks@6 @emotion/react mantine-datatable@6',
          },
          {
            title: 'npm',
            language: 'bash',
            content: 'npm i @mantine/core@6 @mantine/hooks@6 @emotion/react mantine-datatable@6',
          },
        ]}
      />
      <PageText info>
        If you are using Next.js, you also need to install <Code>@mantine/next</Code> and <Code>@emotion/server</Code>{' '}
        and make sure to follow the Mantine{' '}
        <ExternalLink to="https://mantine.dev/guides/next/">usage with Next.js</ExternalLink> guide.
      </PageText>
      <PageText>Then you can import the component and use it in your application like so:</PageText>
      <CodeBlock language="typescript" content={code} />
      <PageText>The code above will produce the following result:</PageText>
      <GettingStartedExample />
      <PageText>
        <InternalLink to={getFirstExamplePagePath()}>Browse the code examples</InternalLink> to see the component in
        action and learn how to use it, and refer to the{' '}
        <InternalLink to="/component-properties">component properties</InternalLink> for an exhaustive list of
        customizable options.
      </PageText>
      <PageNavigation of={PATH} />
    </Container>
  );
}
