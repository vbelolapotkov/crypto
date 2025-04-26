import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import bybitRoutes from './routes/bybit';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/bybit', bybitRoutes);

export default app;
