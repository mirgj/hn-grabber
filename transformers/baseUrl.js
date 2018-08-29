const baseUrl = (url) => {
  return unescape(url).replace(/(http(s)?:\/\/)|(\/.*){1}/g, '');
};

export default baseUrl;
