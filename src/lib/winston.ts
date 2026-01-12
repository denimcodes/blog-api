/**
 * @copyright 2026 Denimsun Basumatary
 * @license Apache-2.0
 */

 import winston from 'winston'
 
 import config from '@/config'
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
 
const { combine, timestamp, json, errors, align, printf, colorize } = winston.format;

const logtail = new Logtail(config.LOGTAIL_SOURCE_TOKEN, {
  endpoint: config.LOGTAIL_INGESTING_HOST
});

const transports: winston.transport[] = [];

if (config.NODE_ENV === 'production') {
  if (!config.LOGTAIL_INGESTING_HOST || !config.LOGTAIL_SOURCE_TOKEN) {
    throw new Error('Logtail ingesting host and source token are required in production');
  }
  transports.push(new LogtailTransport(logtail));
}

if (config.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({all: true}),
        timestamp({format: 'YYYY-MM-DD hh:mm:ss A'}),
        align(),
        printf(({ timestamp, level, message, ...meta}) => {
          const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta)}` : '';
          
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        })
      )
    })
  )
}

const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({stack:true}), json()),
  transports,
  silent: config.NODE_ENV === 'test' // Disable logging in test
})

export {logger, logtail}