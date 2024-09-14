import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  MONGODB_URI: process.env.MONGO_URI || 'mongodb://localhost/nest',
}));
