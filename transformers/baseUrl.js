const baseUrl = (url) => {
  return url.replace(/(http(s)?:\/\/)|(\/.*){1}/g, '');
};

export default baseUrl;
