import { MantineColor } from '@mantine/core';
import {
  IconAdjustments,
  IconBellFilled,
  IconHeartHandshake,
  IconHome,
  IconLifebuoy,
  IconList,
  IconRocket,
  IconSpeakerphone,
} from '@tabler/icons-react';
import { FC } from 'react';

export const SEO_DEFAULT_TITLE = 'Mantine DataTable: the React table component for Mantine';
export const SEO_DEFAULT_DESCRIPTION =
  'A fully-featured data-table/data-grid React component for building data-rich applications with Mantine UI';
export const SEO_CREATOR = '@icflorescu';

export const HEADER_HEIGHT = 56;
export const FOOTER_BREAKPOINT = 1200;
export const FOOTER_HEIGHT_BELOW_BREAKPOINT = 164;
export const FOOTER_HEIGHT_ABOVE_BREAKPOINT = 64;
export const NAVBAR_WIDTH = 300;
export const NAVBAR_BREAKPOINT = 'md';

export const AUTHOR_LINK = 'https://github.com/icflorescu';
export const REPO_LINK = 'https://github.com/icflorescu/mantine-datatable-v6';
export const NPM_LINK = 'https://www.npmjs.com/package/mantine-datatable';
export const LICENSE_LINK = `${REPO_LINK}/blob/main/LICENSE`;
export const SPONSOR_LINK = 'https://github.com/sponsors/icflorescu';
export const MANTINE_CONTEXTMENU_LINK = 'https://icflorescu.github.io/mantine-contextmenu/';
export const MANTINE_LINK = 'https://mantine.dev';
export const NEXTJS_LINK = 'https://nextjs.org';
export const VITE_LINK = 'https://vitejs.dev';
export const REMIX_LINK = 'https://remix.run';
export const CRA_LINK = 'https://create-react-app.dev';
export const GATSBY_LINK = 'https://www.gatsbyjs.com';

export const DOCSEARCH_APP_ID = 'QTPWIJ4FEH';
export const DOCSEARCH_INDEX_NAME = 'mantine-datatable';
export const DOCSEARCH_API_KEY = 'b6e1b8f8ada26b807cb65d32ad33ac21';

export const PAGES: ({ external?: true; title: string; color?: MantineColor; description?: string } & (
  | {
      path?: string;
      icon: FC<{ size?: string | number }>;
      items?: never;
    }
  | {
      path: string;
      icon?: never;
      items: { path: string; title: string; description?: string }[];
    }
))[] = [
  { title: 'Home', description: SEO_DEFAULT_DESCRIPTION, icon: IconHome },
  {
    path: 'getting-started',
    title: 'Getting started',
    description: 'How to install Mantine DataTable, its dependencies and how to import and use it in your application',
    color: 'orange',
    icon: IconRocket,
  },
  {
    path: 'examples',
    title: 'Examples',
    color: 'green',
    items: [
      { path: 'basic-usage', title: 'Basic usage', description: 'Example: basic usage of Mantine DataTable' },
      {
        path: 'basic-table-properties',
        title: 'Basic table properties',
        description: 'Example: how to set the basic Mantine DataTable properties',
      },
      {
        path: 'column-properties',
        title: 'Column properties',
        description: 'Example: setting Mantine DataTable column properties',
      },
      {
        path: 'column-grouping',
        title: 'Column grouping',
        description: 'Example: group multiple columns under a shared header',
      },
      {
        path: 'customizing-border-colors',
        title: 'Customizing border colors',
        description: 'Example: how to customize the border colors of Mantine DataTable',
      },
      {
        path: 'additional-styling',
        title: 'Additional styling',
        description: 'Example: more ways to style a Mantine DataTable component',
      },
      {
        path: 'non-standard-record-ids',
        title: 'Non-standard record IDs',
        description: 'Example: using non-standard record IDs with Mantine DataTable',
      },
      {
        path: 'default-column-properties',
        title: 'Default column properties',
        description: 'Example: using default column properties with Mantine DataTable',
      },
      {
        path: 'default-column-render',
        title: 'Default column render',
        description: 'Example: using a default column render function with Mantine DataTable',
      },
      {
        path: 'scrollable-vs-auto-height',
        title: 'Scrollable vs. auto-height',
        description: 'Example: how to make the Mantine DataTable vertically scrollable',
      },
      {
        path: 'empty-state',
        title: 'Empty state',
        description: 'Example: Mantine DataTable shows an empty state indicator when is provided with an empty array',
      },
      {
        path: 'pagination',
        title: 'Pagination',
        description: 'Example: using paged data with Mantine DataTable',
      },
      {
        path: 'sorting',
        title: 'Sorting',
        description: 'Example: sorting data with Mantine DataTable',
      },
      {
        path: 'infinite-scrolling',
        title: 'Implementing infinite scrolling',
        description: 'Example: implementing infinite scrolling with Mantine DataTable',
      },
      {
        path: 'searching-and-filtering',
        title: 'Searching and filtering',
        description: 'Example: searching and filtering data with Mantine DataTable',
      },
      {
        path: 'records-selection',
        title: 'Records selection',
        description: 'Example: how to enable multiple records selection on Mantine DataTable',
      },
      {
        path: 'handling-row-clicks',
        title: 'Handling row clicks',
        description: 'Example: handling row click events on Mantine DataTable',
      },
      {
        path: 'handling-cell-clicks',
        title: 'Handling cell clicks',
        description: 'Example: handling cell click events on Mantine DataTable',
      },
      {
        path: 'row-context-menu',
        title: 'Row context menu',
        description: 'Example: working with row context menus on Mantine DataTable',
      },
      {
        path: 'expanding-rows',
        title: 'Expanding rows',
        description: 'Example: expanding and collapsing rows on Mantine DataTable',
      },
      {
        path: 'nested-tables',
        title: 'Nested tables',
        description: 'Example: how to implement nested tables with Mantine DataTable',
      },
      {
        path: 'nested-tables-with-async-data-loading',
        title: 'Nested tables with async data loading',
        description: 'Example: how to implement nested Mantine DataTables with async data loading',
      },
      {
        path: 'nested-tables-with-async-data-loading-and-sorting',
        title: 'Nested tables with async data loading and sorting',
        description: 'Example: how to implement nested Mantine DataTables with async data loading and sorting',
      },
      {
        path: 'row-actions-cell',
        title: 'Row actions cell',
        description: 'Example: how to implement a row actions cell on Mantine DataTable',
      },
      {
        path: 'pinning-the-last-column',
        title: 'Pinning the last column',
        description: 'Example: how to pin the last column on Mantine DataTable',
      },
      {
        path: 'links-or-buttons-inside-clickable-rows-or-cells',
        title: 'Links or buttons inside clickable rows/cells',
        description: 'Example: how to add links or buttons inside Mantine DataTable clickable rows or cells',
      },
      {
        path: 'disabling-text-selection',
        title: 'Disabling text selection',
        description: 'Example: disabling text selection on Mantine DataTable',
      },
      {
        path: 'asynchronous-data-loading',
        title: 'Asynchronous data loading',
        description: 'Example: loading data asynchronously with Mantine DataTable and customizing the loader',
      },
      {
        path: 'custom-row-or-cell-attributes',
        title: 'Custom row or cell attributes',
        description: 'Example: How to add custom attributes to Mantine DataTable rows or cells',
      },
      {
        path: 'using-with-auto-animate',
        title: 'Using bodyRef with AutoAnimate',
        description: 'Example: How to use Mantine DataTable bodyRef property with AutoAnimate',
      },
      {
        path: 'complex-usage',
        title: 'Complex usage',
        description:
          'Example: a complex usage scenario for Mantine DataTable featuring custom column definitions, asynchronous data loading with React Query, sorting, pagination, custom cell data rendering, multiple row selection, and row context-menu',
      },
    ],
  },
  {
    path: 'component-properties',
    title: 'Component properties',
    description:
      'Mantine DataTable component is written in TypeScript and its properties are well documented with additional JSDoc annotations',
    color: 'grape',
    icon: IconAdjustments,
  },
  {
    path: 'contribute-and-support',
    title: 'Contribute & support',
    description:
      'Contribute and support the development of Mantine DataTable by raising issues, bringing up new ideas, coming up with pull-requests, starring the repo or hiring its author',
    color: 'teal',
    icon: IconLifebuoy,
  },
  {
    path: 'who-is-using-mantine-datatable',
    title: 'Who is using Mantine DataTable',
    description:
      'Mantine DataTable is used by awesome companies and developers all around the world. Are you one of them?',
    color: 'violet',
    icon: IconSpeakerphone,
  },
  {
    path: 'hire-the-author',
    title: 'Hire the author',
    description:
      'If you’re looking for expertise and want to support the project, hire the author of Mantine DataTable - a fullstack/frontend developer with 20+ years of experience',
    color: 'red',
    icon: IconHeartHandshake,
  },
  {
    path: 'mantine-v7-support',
    title: 'Mantine V7 support',
    description:
      'Mantine DataTable v6.x supports Mantine v6.x. Mantine v7.x support is on the roadmap. You can speed up the process by sponsoring me on GitHub.',
    color: 'pink',
    icon: IconBellFilled,
  },
  {
    external: true,
    path: `${REPO_LINK}/blob/main/CHANGELOG.md`,
    title: 'Changelog',
    description: 'Mantine DataTable changelog',
    color: 'gray',
    icon: IconList,
  },
];
