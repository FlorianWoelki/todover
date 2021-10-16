import { Response } from 'express';

const cookieIdentifier = 'jid';

export const sendRefreshToken = (res: Response, token: string) => {
  const expirationDate = new Date(Date.now() + 30 * 24 * 3600 * 1000);
  if (process.env.NODE_ENV === 'production') {
    res.cookie(cookieIdentifier, token, {
      httpOnly: true,
      secure: true,
      domain: '.todover.com',
      expires: expirationDate,
    });
  } else {
    res.cookie(cookieIdentifier, token, { expires: expirationDate });
  }
};

export const clearRefreshToken = (res: Response) => {
  res.clearCookie(cookieIdentifier);
};
