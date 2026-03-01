import dotenv from 'dotenv';
dotenv.config();

import app from './index.js';
import { ConnectDb } from './config/connectDB.js';
import { envConfig } from './config/env.config.js';

app.listen(envConfig.PORT, async () => {
  console.log(`Server running on port ${envConfig.PORT}`);
  await ConnectDb();
});
