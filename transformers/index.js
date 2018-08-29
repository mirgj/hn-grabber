import timestamp from './timestamp';
import baseUrl from './baseUrl';
import replacer from './replacer';
import unescape from './unescape';
import dateParser from './dateParser';

const init = (type) => {
  switch (type) {
    case 'timestamp':
      return timestamp;
    case 'baseUrl':
      return baseUrl;
    case 'replacer':
      return replacer;
    case 'unescape':
      return unescape;
    case 'dateParser':
      return dateParser;
    default: throw new Error('Transformer not found');
  }
};

export default init;
