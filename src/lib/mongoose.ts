/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import mongoose, { ConnectOptions } from 'mongoose';

import config from '@/config';
import { logger } from '@/lib/winston';
import { log } from 'winston';

const clientOptions: ConnectOptions = {
  dbName: 'blog-db',
  appName: 'Blog API',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
};

export const connectToDb = async () => {
  if (!config.MONGODB_URI) {
    throw new Error('Mongo DB uri has not been defined in config')
  }
  
  try {
    await mongoose.connect(config.MONGODB_URI)
    logger.info('Connected to db successfully', {
      uri: config.MONGODB_URI,
      options: clientOptions
    })
  } catch(err) {
    if (err instanceof Error) {
      throw err;
    }
    
    logger.error('Error connecting to the database', err)
  }
  
}

export const disconnectFromDb = async () => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from the database successfully.', {
      uri: config.MONGODB_URI,
      options: clientOptions
    })
  } catch(err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    
    logger.error('Error disconnecting from the database', err)
  }
}
