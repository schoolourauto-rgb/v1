import webpush from 'web-push';
// Use centralized logger instead of console.log
import { logger } from '../lib/monitoring/logger';
logger.info('Generated VAPID keys', webpush.generateVAPIDKeys());
