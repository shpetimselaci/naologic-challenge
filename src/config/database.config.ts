import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  MONGO_URI: process.env.MONGO_URI,
}));
