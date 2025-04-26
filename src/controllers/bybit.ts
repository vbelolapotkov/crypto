import { Request, Response } from 'express';
import bybitApi from '../lib/bybit/api';

export const getWalletBalance = async (req: Request, res: Response) => {
  const responseData = await bybitApi.getWalletBalance();
  res.send(responseData);
};
