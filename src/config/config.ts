import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  bybitApiKey: process.env.BYBIT_API_KEY || '',
  bybitApiSecret: process.env.BYBIT_API_SECRET || '',
};

export default config;
