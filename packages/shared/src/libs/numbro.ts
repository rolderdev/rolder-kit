import { set } from './just';

import numbro from 'numbro';
// @ts-ignore
import locale from 'numbro/dist/languages/ru-RU.min.js';
locale.delimiters.decimal = '.';
numbro.registerLanguage(locale);
numbro.setLanguage('ru-RU');
export type Numbro = typeof numbro;
set(window, ['R', 'libs', 'numbro'], numbro);
