/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import app from '@/app';
import config from '@/config';
import { connectToDb, disconnectFromDb } from '@/lib/mongoose';
import { logger, logtail } from '@/lib/winston';

(async () => {
  try {
    await connectToDb();

    app.listen(config.PORT, () => {
      logger.info(`Server running: http://localhost:${config.PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start the server', err);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDb();
    logger.warn('Server SHUTDOWN');
    process.exit(0);
    
    await logtail.flush();
  } catch (err) {
    logger.error('Error during server shutdown', err);
  }
};

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
