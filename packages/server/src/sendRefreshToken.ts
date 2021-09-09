import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string) => {
  if (process.env.NODE_ENV === 'production') {
    res.cookie('jid', token, { httpOnly: true, secure: true, domain: '.todover.com' });
  } else {
    res.cookie('jid', token, { httpOnly: true, secure: true });
  }
};
