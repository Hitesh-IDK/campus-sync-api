import dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/.env` });

process.on('uncaughtException', (err: Error) => {
  console.log(`Error: ${err.name} ${err.message}`);

  mongoClient.close();
  server.close(() => {
    process.exit(1);
  });
});

import app from './src/app';
import { mongoClient } from './src/database/connection';

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}..`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.name} ${err.message}`);

  mongoClient.close();
  server.close(() => {
    process.exit(1);
  });
});
