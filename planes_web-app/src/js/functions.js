export const map = (value, in_min, in_max, out_min, out_max) => {
  return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export const round = (value, n = 2) => {
  const multiplier = n * 10;
  return Math.round(value * multiplier) / multiplier;
};
