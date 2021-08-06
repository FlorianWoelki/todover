// @ts-ignore
import Cookies from 'js-cookie';

export const refreshCookie = (key: string): void => {
  const cookie = getCookie(key);
  if (cookie) {
    setCookie(key, cookie);
  }
};

export const setCookie = (key: string, value: boolean): void => {
  Cookies.set(key, value, { expires: 36500, secure: true });
};

export const getCookie = (key: string): boolean | undefined => {
  return Cookies.get(key);
};

export const removeCookie = (key: string): string => {
  return Cookies.remove(key);
};
