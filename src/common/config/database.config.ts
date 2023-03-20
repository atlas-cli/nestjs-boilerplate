import { registerAs } from '@nestjs/config';

const databaseConfig = () => {
  if (process.env.DATABASE_TYPE !== 'mongodb') {
    throw new Error('you need use env with DATABASE_TYPE=mongodb');
  }
  const config = {
    type: process.env.DATABASE_TYPE,
    uri: process.env.DATABASE_URI,
  };
  return config;
};
export default registerAs('database', databaseConfig);
