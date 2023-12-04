# Mantine DataTable V6

![Publish NPM & deploy docs workflow](https://github.com/icflorescu/mantine-datatable-v6/actions/workflows/publish-and-deploy.yml/badge.svg)  
[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Stars][stars-image]][stars-url]
[![Last commit][last-commit-image]][repo-url]
[![Closed issues][closed-issues-image]][closed-issues-url]
[![Downloads][downloads-image]][npm-url]
[![Language][language-image]][repo-url]
[![Sponsor the author][sponsor-image]][sponsor-url]

⚠️ Mantine DataTable V6 is compatible with [Mantine V6](https://v6.mantine.dev/).
💡 If you're using Mantine V7, please use [Mantine DataTable V7](https://icflorescu.github.io/mantine-datatable/).

The lightweight, dependency-free, "dark-theme aware" [**table component**](https://icflorescu.github.io/mantine-datatable-v6/) for your Mantine UI data-rich applications, featuring asynchronous data loading support, pagination, intuitive Gmail-style additive batch rows selection, column sorting, custom cell data rendering, row context menu, row expansion, nesting, and more.

[![Mantine DataTable](https://user-images.githubusercontent.com/581999/189911698-369ba48e-65f0-4772-aad3-cb5e6d4cb59d.png)](https://icflorescu.github.io/mantine-datatable-v6/)

## Features

- **Lightweight** - no external dependencies, [no bloat](https://bundlephobia.com/package/mantine-datatable)
- **Dark theme aware** - works out of the box with [Mantine's dark theme](https://mantine.dev/guides/dark-theme/)
- **[Fully customizable](https://icflorescu.github.io/mantine-datatable-v6/examples/additional-styling)** - you can customize the look and feel of the table and its components
- **[Asynchronous data loading](https://icflorescu.github.io/mantine-datatable-v6/examples/asynchronous-data-loading)** - load data from a remote API endpoint and show a loading indicator while waiting for the response
- **[Pagination](https://icflorescu.github.io/mantine-datatable-v6/examples/pagination)** - split large data sets into pages
- **[Column sorting](https://icflorescu.github.io/mantine-datatable-v6/examples/sorting)** - sort data by one or more columns
- **[Custom cell data rendering](https://icflorescu.github.io/mantine-datatable-v6/examples/column-properties)** - render cell data using custom components
- **[Row context menu](https://icflorescu.github.io/mantine-datatable-v6/examples/row-context-menu)** - show a context menu when right-clicking on a row
- **[Row expansion](https://icflorescu.github.io/mantine-datatable-v6/examples/expanding-rows)** - expand a row to show additional details
- **[Nesting](https://icflorescu.github.io/mantine-datatable-v6/examples/nested-tables)** - nest tables to show hierarchical data
- **[Additive batch rows selection](https://icflorescu.github.io/mantine-datatable-v6/examples/records-selection)** - select or deselect ranges of rows using the Shift key
- **[Automatically-scrollable](https://icflorescu.github.io/mantine-datatable-v6/examples/scrollable-vs-auto-height)** - automatically scrollable or auto-height
- **[AutoAnimate support](https://icflorescu.github.io/mantine-datatable/examples-v6/using-with-auto-animate)** - animate row sorting, addition and removal
- **More** - check out the [full documentation](https://icflorescu.github.io/mantine-datatable-v6/)

## Trusted by the community

Emil Sorensen @ [kapa.ai](https://kapa.ai/):

> _Mantine DataTable is a great component that’s core to our web app - it saves us a ton of time and comes with great styling and features out of the box_

[![Who's using Mantine DataTable](https://user-images.githubusercontent.com/581999/258483859-f8f46b97-5900-4871-8243-c7316fbc244f.png)](https://icflorescu.github.io/mantine-datatable-v6/)

[Mantine DataTable](https://icflorescu.github.io/mantine-datatable-v6/) is used by developers and startups around the world, such as: [kapa.ai](https://kapa.ai/), [exdatis.ai](https://exdatis.ai/), [teachfloor](https://www.teachfloor.com/), [MARKUP](https://www.getmarkup.com/), [BookieBase](https://bookiebase.ie/), [zipline](https://zipline.diced.tech/), [Pachtop](https://github.com/pacholoamit/pachtop), [Ganymede](https://github.com/Zibbp/ganymede), [COH3 Stats](https://coh3stats.com/), [Culver City Rental Registry](https://www.ccrentals.org/) and many more.

If you're using [Mantine DataTable](https://icflorescu.github.io/mantine-datatable-v6/) in your project, please drop me a line at the email address listed in my [GitHub profile](https://github.com/icflorescu) and I'll be happy to add it to the list and on the [documentation website](https://icflorescu.github.io/mantine-datatable-v6/).

## Full documentation and examples

Visit [icflorescu.github.io/mantine-datatable-v6](https://icflorescu.github.io/mantine-datatable-v6/) to view the full documentation and learn how to use it by browsing a comprehensive list of examples.

## Quickstart

Install the package and its dependencies (this package supports Mantine V6; the V7 version is under development):

```sh
npm i @mantine/core@6 @mantine/hooks@6 @emotion/react mantine-datatable@6
```

If you're using Next.js, Vite, CRA, Remix or Gatsby, you might need to install additional dependencies. Please refer to Mantine's [getting started page](https://v6.mantine.dev/pages/getting-started/) for more details.

Use it in your code:

```ts
import { Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

export default function GettingStartedExample() {
  return (
    <DataTable
      withBorder
      borderRadius="sm"
      withColumnBorders
      striped
      highlightOnHover
      // provide data
      records={[
        { id: 1, name: 'Joe Biden', bornIn: 1942, party: 'Democratic' },
        // more records...
      ]}
      // define columns
      columns={[
        {
          accessor: 'id',
          // this column has a custom title
          title: '#',
          // right-align column
          textAlignment: 'right',
        },
        { accessor: 'name' },
        {
          accessor: 'party',
          // this column has custom cell data rendering
          render: ({ party }) => (
            <Text weight={700} color={party === 'Democratic' ? 'blue' : 'red'}>
              {party.slice(0, 3).toUpperCase()}
            </Text>
          ),
        },
        { accessor: 'bornIn' },
      ]}
      // execute this callback when a row is clicked
      onRowClick={({ name, party, bornIn }) =>
        alert(`You clicked on ${name}, a ${party.toLowerCase()} president born in ${bornIn}.`)
      }
    />
  );
}
```

Make sure to browse the comprehensive list of [usage examples](https://icflorescu.github.io/mantine-datatable-v6/examples/basic-usage) to learn how to unleash the full power of Mantine DataTable.

## Other useful resources

Mantine DataTable had the context-menu functionality baked in since its early days. If you're looking to use a context menu in other parts of your application, you might want to check out [Mantine Context Menu](https://icflorescu.github.io/mantine-contextmenu-v6/).

## Code contributors

[![Contributors list](https://contrib.rocks/image?repo=icflorescu/mantine-datatable)](https://github.com/icflorescu/mantine-datatable/graphs/contributors)

Want to [become a code contributor](https://icflorescu.github.io/mantine-datatable-v6/contribute-and-support)?

## Sponsor the project

If you find this package useful, please consider ❤️ [sponsoring my work](https://github.com/sponsors/icflorescu). Your sponsorship will help me dedicate more time to maintaining the project and will encourage me to add new features and fix existing bugs. If you're a company using Mantine DataTable in a commercial project, you can also [hire my services](https://github.com/icflorescu).

## Other means of support

If you find this package useful, please 🙏 star the repository, 💕 [tweet about it](http://twitter.com/share?text=Build%20data-rich%20React%20applications%20with%20Mantine%20DataTable&url=https%3A%2F%2Fgithub.com%2Ficflorescu%2Fmantine-datatable&hashtags=mantine%2Cdatatable%2Cdatagrid%2Creact&via=icflorescu), 👍 [endorse me on LinkedIn](https://www.linkedin.com/in/icflorescu) or consider hiring my services.

The more stars this repository gets, the more visibility it gains among the Mantine users community. The more
users it gets, the more chances that some of those users will become active code contributors willing to put
their effort into bringing new features to life and/or fixing bugs.

As the repository gain awareness, my chances of getting hired to work on Mantine-based projects will increase,
which in turn will help maintain my vested interest in keeping the project alive.

## Hiring the author

If you want to hire my services, don’t hesitate to drop me a line at the email address listed in my [GitHub profile](https://github.com/icflorescu).
I’m currently getting a constant flow of approaches, some of them relevant, others not so relevant.
Mentioning “Mantine DataTable” in your text would help me prioritize your message.

## Acknowledgements

🙏 Special thanks to [Ani Ravi](https://github.com/aniravi24) for being the first person to sponsor my work on this project!

## License

The [MIT License](https://github.com/icflorescu/mantine-datatable/blob/master/LICENSE).

[npm-url]: https://npmjs.org/package/mantine-datatable
[repo-url]: https://github.com/icflorescu/mantine-datatable
[stars-url]: https://github.com/icflorescu/mantine-datatable/stargazers
[closed-issues-url]: https://github.com/icflorescu/mantine-datatable/issues?q=is%3Aissue+is%3Aclosed
[license-url]: LICENSE
[npm-image]: https://img.shields.io/npm/v/mantine-datatable.svg?style=flat-square
[license-image]: http://img.shields.io/npm/l/mantine-datatable.svg?style=flat-square
[downloads-image]: http://img.shields.io/npm/dm/mantine-datatable.svg?style=flat-square
[stars-image]: https://img.shields.io/github/stars/icflorescu/mantine-datatable?style=flat-square
[last-commit-image]: https://img.shields.io/github/last-commit/icflorescu/mantine-datatable?style=flat-square
[closed-issues-image]: https://img.shields.io/github/issues-closed-raw/icflorescu/mantine-datatable?style=flat-square
[language-image]: https://img.shields.io/github/languages/top/icflorescu/mantine-datatable?style=flat-square
[sponsor-image]: https://img.shields.io/badge/sponsor-violet?style=flat-square
[sponsor-url]: https://github.com/sponsors/icflorescu
