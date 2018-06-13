import timestamp from './timestamp';
import baseUrl from './baseUrl';

const init = (type) => {
  if (type === 'timestamp')
    return timestamp;
  if (type === 'baseUrl')
    return baseUrl;
  throw new Error('Transformer not found');
};

export default init;
