import * as path from 'path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'site'),
  title: 'Rolder Kit',
  description: 'Rolder Kit',
  icon: '/rspress-icon.png',
  logo: {
    light: '/rolder.ico',
    dark: '/rolder.ico',
  },
  themeConfig: {
    darkMode: false,
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/rolderdev/rolder-kit' },
    ],
  },
  ssg: false,
});
