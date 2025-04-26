import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import bybitApi from './lib/bybit/api';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/wallet-balance', async (req, res) => {
  const responseData = await bybitApi.getWalletBalance();
  res.send(responseData);
});

export default app;
