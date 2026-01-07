/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

import express from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

import config from '@/config';
import limiter from '@/lib/express_late_limit';
import v1Routes from '@/routes/v1'
import { logger } from '@/lib/winston';

const app = express();

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS Error: ${origin} is not allowed by CORS`),
        false,
      );
      logger.warn(
        `CORS Error: ${origin} is not allowed by CORS`,
      );
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// Enable response compression for smaller payload size
app.use(compression());

// Enhance security by setting various HTTP headers
app.use(helmet())

app.use(limiter);

app.use('/api/v1', v1Routes);

export default app;