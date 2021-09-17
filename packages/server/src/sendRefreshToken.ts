import { Response } from 'express';

const cookieIdentifier = 'jid';

export const sendRefreshToken = (res: Response, token: string) => {
  if (process.env.NODE_ENV === 'production') {
    res.cookie(cookieIdentifier, token, { httpOnly: true, secure: true, domain: '.todover.com' });
  } else {
    res.cookie(cookieIdentifier, token, { httpOnly: true, secure: true });
  }
};

export const clearRefreshToken = (res: Response) => {
  res.clearCookie(cookieIdentifier);
};
