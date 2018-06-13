const transform = (time) => {
  const val = new Date(Number(time) * 1000);
  if (isNaN(val)) throw new Error('Timestamp format error: ' + time);

  return val;
};

export default transform;
