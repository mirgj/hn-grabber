import storyMapper from './story-mapper';

const init = (type) => {
  if (type === 'storyMapper')
    return storyMapper;
  throw new Error('Mapper not found');
};

export default init;
