import * as path from 'path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Rolder Kit',
  description: 'Rolder Kit documentation',
  icon: '/rspress-icon.png',
  logo: {
    light: '/rolder.ico',
    dark: '/rolder.ico',
  },
  themeConfig: {
    darkMode: false,
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/rolderman/rolder-kit' },
    ],
  },
  ssg: false,
  builderConfig: {
    output: {
      assetPrefix: 'https://kit.rolder.app/',
    },
    html: {
      tags: [
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://kit.rolder.app/styles.css',
            mime: 'text/css'
          },
        },
      ],
    },
  },
});
