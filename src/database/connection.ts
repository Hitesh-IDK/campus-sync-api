import { Pool, PoolConfig } from 'pg';
import { MongoClient, ServerApiVersion } from 'mongodb';

export const config: PoolConfig = {
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  host: process.env.DBHOST,
  port: Number(process.env.DBPORT),
};

export const pool = new Pool(config);

const uri = process.env.MONGO_URI;

export const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
