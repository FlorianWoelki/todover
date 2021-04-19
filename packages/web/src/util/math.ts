export const mod = (num: number, mod: number) => {
  return ((num % mod) + mod) % mod;
};
