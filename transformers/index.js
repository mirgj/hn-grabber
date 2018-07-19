import timestamp from './timestamp';
import baseUrl from './baseUrl';
import replacer from './replacer';

const init = (type) => {
  if (type === 'timestamp')
    return timestamp;
  if (type === 'baseUrl')
    return baseUrl;
  if (type === 'replacer')
    return replacer;
  throw new Error('Transformer not found');
};

export default init;
