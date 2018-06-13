import transformers from '../transformers/index';

const storyMapper = (mappings, obj) => {
  var item = {};

  mappings.forEach(el => {
    if (!el.to) {
      console.warn('"to" not available for mapping. Object: ' + JSON.stringify(el));
      return;
    }

    if (!el.from && el.default) {
      item[el.to] = el.default;
      return;
    }

    if (!el.from) {
      console.warn('when "from" is not defined default value must be provided: ' + JSON.stringify(el));
      return;
    }

    if (el.default && !obj[el.from]) {
      item[el.to] = el.default;
      return;
    }

    if (el.transformer) {
      item[el.to] = transformers(el.transformer)(obj[el.from]);
      return;
    }

    item[el.to] = obj[el.from];
  });

  return item;
};

export default storyMapper;
