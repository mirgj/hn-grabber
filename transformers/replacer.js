const transform = (title, config) => {
  return title.replace(config.old_string, config.new_string);
};

export default transform;
